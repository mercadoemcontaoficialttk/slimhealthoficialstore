import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

const PARADISE_BASE_URL = 'https://multi.paradisepags.com/api/v1';

interface CreatePixRequest {
  action?: 'create' | 'status' | 'health';
  amount?: number;
  description?: string;
  reference?: string;
  id?: string;
  customer?: { name: string; email: string; document: string; phone: string };
  tracking?: Record<string, string | undefined>;
}

function sanitizeCustomer(c: { name: string; email: string; document: string; phone: string }) {
  return {
    name: (c.name || '').trim().replace(/\s*[-–]\s*\d+\s*$/, '').replace(/\s{2,}/g, ' ').trim(),
    email: (c.email || '').trim().toLowerCase(),
    document: (c.document || '').replace(/\D/g, ''),
    phone: (c.phone || '').replace(/\D/g, ''),
  };
}

function isValidCpf(d: string): boolean {
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(d[i]) * (10 - i);
  let r = (s * 10) % 11; if (r === 10) r = 0;
  if (r !== parseInt(d[9])) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(d[i]) * (11 - i);
  r = (s * 10) % 11; if (r === 10) r = 0;
  return r === parseInt(d[10]);
}

function validateCustomer(c: { name: string; email: string; document: string; phone: string }): string | null {
  if (!c.name || c.name.length < 2) return 'Nome inválido';
  if (!c.email || !c.email.includes('@') || !c.email.includes('.')) return 'Email inválido';
  if (!isValidCpf(c.document)) return 'CPF inválido (dígitos verificadores não conferem)';
  if (c.phone.length < 10 || c.phone.length > 11) return 'Telefone inválido';
  return null;
}

async function attemptCreate(payload: Record<string, unknown>, apiKey: string) {
  const response = await fetch(`${PARADISE_BASE_URL}/transaction.php`, {
    method: 'POST',
    headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return { response, data };
}

function jsonResponse(body: Record<string, unknown>, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(body), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200, headers: corsHeaders });

  try {
    const PARADISE_API_KEY = Deno.env.get('PARADISE_API_KEY');
    if (!PARADISE_API_KEY) return jsonResponse({ error: 'Chave de API não configurada no servidor' }, corsHeaders);

    const url = new URL(req.url);

    if (req.method === 'GET') {
      const action = url.searchParams.get('action');
      if (action === 'health') return jsonResponse({ ok: true, timestamp: new Date().toISOString() }, corsHeaders);
      if (action === 'status') return await handleStatusCheck(url.searchParams.get('id'), url.searchParams.get('reference'), PARADISE_API_KEY, corsHeaders);
      return jsonResponse({ error: 'Invalid GET action' }, corsHeaders);
    }

    if (req.method === 'POST') {
      const body: CreatePixRequest = await req.json();
      const action = body.action || 'create';
      console.log('POST request received, action:', action);

      if (action === 'health') return jsonResponse({ ok: true, timestamp: new Date().toISOString() }, corsHeaders);
      if (action === 'status') return await handleStatusCheck(body.id || null, body.reference || null, PARADISE_API_KEY, corsHeaders);

      if (action === 'create') {
        if (!body.amount || !body.description || !body.customer) {
          return jsonResponse({ error: 'Campos obrigatórios faltando: amount, description, customer' }, corsHeaders);
        }

        const cleanCustomer = sanitizeCustomer(body.customer);
        const validationError = validateCustomer(cleanCustomer);
        if (validationError) {
          console.error('Validation failed:', validationError, 'document:', cleanCustomer.document);
          return jsonResponse({ error: validationError, validation_failed: true }, corsHeaders);
        }

        const txReference = body.reference || `ref_${Date.now()}`;
        const basePayload: Record<string, unknown> = {
          amount: body.amount, description: body.description, reference: txReference,
          source: 'api_externa', customer: cleanCustomer,
        };

        const hasTracking = body.tracking && Object.keys(body.tracking).length > 0;

        // Attempt A: with tracking
        const payloadA = hasTracking ? { ...basePayload, tracking: body.tracking } : basePayload;
        console.log('Creating PIX (attempt A):', JSON.stringify(payloadA));
        let result = await attemptCreate(payloadA, PARADISE_API_KEY);
        console.log('Attempt A - status:', result.response.status);

        // Attempt B: without tracking
        if (!result.response.ok && result.response.status === 400 && hasTracking) {
          console.log('⚠️ Attempt A failed. Retrying without tracking (B)...');
          result = await attemptCreate({ ...basePayload, reference: `${txReference}_fb` }, PARADISE_API_KEY);
          console.log('Attempt B - status:', result.response.status);
        }

        // Attempt C: minimal
        if (!result.response.ok && result.response.status === 400) {
          console.log('⚠️ Attempt B failed. Retrying minimal (C)...');
          result = await attemptCreate({
            amount: body.amount, description: body.description,
            reference: `min_${Date.now()}`, source: 'api_externa', customer: cleanCustomer,
          }, PARADISE_API_KEY);
          console.log('Attempt C - status:', result.response.status);
        }

        if (!result.response.ok) {
          console.error('All attempts failed:', JSON.stringify(result.data));
          return jsonResponse({
            error: result.data?.message || 'Não foi possível processar seu pagamento. Tente novamente.',
            details: result.data, paradise_status: result.response.status,
          }, corsHeaders);
        }

        console.log('Paradise API success:', JSON.stringify(result.data));
        return jsonResponse(result.data as Record<string, unknown>, corsHeaders);
      }

      return jsonResponse({ error: 'Invalid action' }, corsHeaders);
    }

    return jsonResponse({ error: 'Method not allowed' }, corsHeaders);
  } catch (error: unknown) {
    console.error('Edge function error:', error);
    return jsonResponse({ error: error instanceof Error ? error.message : 'Unknown error' }, getCorsHeaders(req));
  }
});

async function handleStatusCheck(transactionId: string | null, reference: string | null, apiKey: string, corsHeaders: Record<string, string>) {
  if (!transactionId && !reference) return jsonResponse({ error: 'Transaction ID or reference is required' }, corsHeaders);
  try {
    const queryUrl = transactionId
      ? `${PARADISE_BASE_URL}/query.php?action=get_transaction&id=${transactionId}`
      : `${PARADISE_BASE_URL}/query.php?action=list_transactions&external_id=${reference}`;
    const response = await fetch(queryUrl, { headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' } });
    const data = await response.json();
    return jsonResponse(data, corsHeaders);
  } catch (error) {
    console.error('Status check error:', error);
    return jsonResponse({ error: 'Failed to check payment status' }, corsHeaders);
  }
}
