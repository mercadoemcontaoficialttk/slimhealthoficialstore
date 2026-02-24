import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Build CORS headers dynamically to reflect the request origin
function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}

// Paradise API base URL
const PARADISE_BASE_URL = 'https://multi.paradisepags.com/api/v1';

interface CreatePixRequest {
  action?: 'create' | 'status' | 'health';
  amount?: number;
  description?: string;
  reference?: string;
  id?: string;
  customer?: {
    name: string;
    email: string;
    document: string;
    phone: string;
  };
  tracking?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    src?: string;
    sck?: string;
    gclid?: string;
    fbclid?: string;
    tracking_id?: string;
    page_path?: string;
    product_name?: string;
    funnel_step?: string;
  };
}

// Sanitize customer data to ensure clean payloads
function sanitizeCustomer(customer: { name: string; email: string; document: string; phone: string }) {
  return {
    name: (customer.name || '').trim(),
    email: (customer.email || '').trim().toLowerCase(),
    document: (customer.document || '').replace(/\D/g, ''),
    phone: (customer.phone || '').replace(/\D/g, ''),
  };
}

// Validate customer fields before sending to gateway
function validateCustomer(customer: { name: string; email: string; document: string; phone: string }): string | null {
  if (!customer.name || customer.name.length < 2) return 'Nome inválido';
  if (!customer.email || !customer.email.includes('@') || !customer.email.includes('.')) return 'Email inválido';
  if (!customer.document || customer.document.length !== 11) return 'CPF deve ter 11 dígitos';
  if (!customer.phone || (customer.phone.length < 10 || customer.phone.length > 11)) return 'Telefone inválido';
  return null;
}

// Try to create a transaction with the Paradise API, with optional fallback
async function attemptCreateTransaction(
  payload: Record<string, unknown>,
  apiKey: string,
): Promise<{ response: Response; data: Record<string, unknown> }> {
  const response = await fetch(`${PARADISE_BASE_URL}/transaction.php`, {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return { response, data };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  try {
    const PARADISE_API_KEY = Deno.env.get('PARADISE_API_KEY');
    
    if (!PARADISE_API_KEY) {
      console.error('PARADISE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Chave de API não configurada no servidor' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    
    // GET requests
    if (req.method === 'GET') {
      const action = url.searchParams.get('action');
      
      if (action === 'health') {
        return new Response(
          JSON.stringify({ ok: true, timestamp: new Date().toISOString() }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (action === 'status') {
        const transactionId = url.searchParams.get('id');
        const reference = url.searchParams.get('reference');
        
        if (!transactionId && !reference) {
          return new Response(
            JSON.stringify({ error: 'Transaction ID or reference is required' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return await handleStatusCheck(transactionId, reference, PARADISE_API_KEY, corsHeaders);
      }
      
      return new Response(
        JSON.stringify({ error: 'Invalid GET action. Use ?action=health or ?action=status' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST requests
    if (req.method === 'POST') {
      const body: CreatePixRequest = await req.json();
      const action = body.action || 'create';

      console.log('POST request received, action:', action);

      if (action === 'health') {
        return new Response(
          JSON.stringify({ ok: true, timestamp: new Date().toISOString() }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (action === 'status') {
        return await handleStatusCheck(body.id || null, body.reference || null, PARADISE_API_KEY, corsHeaders);
      }

      if (action === 'create') {
        if (!body.amount || !body.description || !body.customer) {
          return new Response(
            JSON.stringify({ error: 'Campos obrigatórios faltando: amount, description, customer' }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Sanitize customer data
        const cleanCustomer = sanitizeCustomer(body.customer);
        
        // Validate before calling gateway
        const validationError = validateCustomer(cleanCustomer);
        if (validationError) {
          console.error('Validation failed:', validationError);
          return new Response(
            JSON.stringify({ error: validationError, validation_failed: true }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const txReference = body.reference || `ref_${Date.now()}`;

        // Build base payload
        const basePayload: Record<string, unknown> = {
          amount: body.amount,
          description: body.description,
          reference: txReference,
          source: 'api_externa',
          customer: cleanCustomer,
        };

        // Attempt A: with tracking
        const hasTracking = body.tracking && Object.keys(body.tracking).length > 0;
        const payloadWithTracking = hasTracking
          ? { ...basePayload, tracking: body.tracking }
          : basePayload;

        console.log('Creating PIX transaction (attempt A):', JSON.stringify(payloadWithTracking));
        console.log('Tracking ID:', body.tracking?.tracking_id);
        console.log('Funnel Step:', body.tracking?.funnel_step);

        let result = await attemptCreateTransaction(payloadWithTracking, PARADISE_API_KEY);

        console.log('Attempt A - status:', result.response.status, 'response:', JSON.stringify(result.data));

        // If attempt A failed with 400 and we had tracking, retry without tracking
        if (!result.response.ok && result.response.status === 400 && hasTracking) {
          console.log('⚠️ Attempt A failed (400). Retrying without tracking (attempt B)...');
          
          // New reference to avoid duplicate
          const fallbackReference = `${txReference}_fb`;
          const fallbackPayload = { ...basePayload, reference: fallbackReference };
          
          result = await attemptCreateTransaction(fallbackPayload, PARADISE_API_KEY);
          console.log('Attempt B - status:', result.response.status, 'response:', JSON.stringify(result.data));
        }

        // If still failed, try with minimal payload
        if (!result.response.ok && result.response.status === 400) {
          console.log('⚠️ Attempt B failed (400). Retrying with minimal payload (attempt C)...');
          
          const minimalReference = `min_${Date.now()}`;
          const minimalPayload = {
            amount: body.amount,
            description: body.description,
            reference: minimalReference,
            source: 'api_externa',
            customer: cleanCustomer,
          };
          
          result = await attemptCreateTransaction(minimalPayload, PARADISE_API_KEY);
          console.log('Attempt C - status:', result.response.status, 'response:', JSON.stringify(result.data));
        }

        if (!result.response.ok) {
          console.error('All attempts failed. Final error:', JSON.stringify(result.data));
          return new Response(
            JSON.stringify({ 
              error: result.data?.message || 'Não foi possível processar seu pagamento. Tente novamente.',
              details: result.data,
              paradise_status: result.response.status 
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Success
        return new Response(
          JSON.stringify(result.data),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Invalid action. Use: create, status, or health' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const corsHeaders = getCorsHeaders(req);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to handle status checks
async function handleStatusCheck(
  transactionId: string | null,
  reference: string | null,
  apiKey: string,
  corsHeaders: Record<string, string>
): Promise<Response> {
  if (!transactionId && !reference) {
    return new Response(
      JSON.stringify({ error: 'Transaction ID or reference is required' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    let queryUrl: string;
    
    if (transactionId) {
      console.log('Checking status for transaction:', transactionId);
      queryUrl = `${PARADISE_BASE_URL}/query.php?action=get_transaction&id=${transactionId}`;
    } else {
      console.log('Searching transaction by reference:', reference);
      queryUrl = `${PARADISE_BASE_URL}/query.php?action=list_transactions&external_id=${reference}`;
    }

    console.log('Query URL:', queryUrl);

    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Status check response:', JSON.stringify(data));
    
    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Status check error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check payment status' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}