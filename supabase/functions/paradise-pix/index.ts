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

// Paradise API base URL (correct according to documentation)
const PARADISE_BASE_URL = 'https://multi.paradisepags.com/api/v1';

interface CreatePixRequest {
  action?: 'create' | 'status' | 'health';
  amount?: number; // em centavos
  description?: string;
  reference?: string;
  id?: string; // transaction ID for status check
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

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  try {
    const PARADISE_API_KEY = Deno.env.get('PARADISE_API_KEY');
    
    if (!PARADISE_API_KEY) {
      console.error('PARADISE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Chave de API não configurada no servidor' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    
    // GET requests - health check or legacy status check
    if (req.method === 'GET') {
      const action = url.searchParams.get('action');
      
      // Health check endpoint
      if (action === 'health') {
        return new Response(
          JSON.stringify({ ok: true, timestamp: new Date().toISOString() }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Legacy status check via GET (kept for compatibility)
      if (action === 'status') {
        const transactionId = url.searchParams.get('id');
        const reference = url.searchParams.get('reference');
        
        if (!transactionId && !reference) {
          return new Response(
            JSON.stringify({ error: 'Transaction ID or reference is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return await handleStatusCheck(transactionId, reference, PARADISE_API_KEY, corsHeaders);
      }
      
      return new Response(
        JSON.stringify({ error: 'Invalid GET action. Use ?action=health or ?action=status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST requests - unified handler with action in body
    if (req.method === 'POST') {
      const body: CreatePixRequest = await req.json();
      const action = body.action || 'create'; // default to create for backwards compatibility

      console.log('POST request received, action:', action);

      // Health check via POST
      if (action === 'health') {
        return new Response(
          JSON.stringify({ ok: true, timestamp: new Date().toISOString() }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Status check via POST
      if (action === 'status') {
        return await handleStatusCheck(body.id || null, body.reference || null, PARADISE_API_KEY, corsHeaders);
      }

      // Create PIX transaction
      if (action === 'create') {
        // Validate required fields
        if (!body.amount || !body.description || !body.customer) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields: amount, description, customer' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Prepare payload for Paradise API according to documentation
        const payload = {
          amount: body.amount,
          description: body.description,
          reference: body.reference || `ref_${Date.now()}`,
          source: 'api_externa', // This makes productHash optional
          customer: {
            name: body.customer.name,
            email: body.customer.email,
            document: body.customer.document.replace(/\D/g, ''), // Remove non-digits
            phone: body.customer.phone.replace(/\D/g, ''), // Remove non-digits
          },
          // Add tracking object for UTMify integration
          ...(body.tracking && Object.keys(body.tracking).length > 0 && { tracking: body.tracking }),
        };

        console.log('Creating PIX transaction with payload:', JSON.stringify(payload));
        console.log('Tracking data received:', JSON.stringify(body.tracking));
         console.log('Tracking ID:', body.tracking?.tracking_id);
         console.log('Page Path:', body.tracking?.page_path);
         console.log('Funnel Step:', body.tracking?.funnel_step);
        console.log('Using API URL:', `${PARADISE_BASE_URL}/transaction.php`);

        const response = await fetch(`${PARADISE_BASE_URL}/transaction.php`, {
          method: 'POST',
          headers: {
            'X-API-Key': PARADISE_API_KEY, // Correct header according to documentation
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        
        console.log('Paradise API response status:', response.status);
        console.log('Paradise API response:', JSON.stringify(data));

        if (!response.ok) {
          console.error('Paradise API error:', JSON.stringify(data));
          // Return 200 with error details so supabase.functions.invoke doesn't throw FunctionsHttpError
          return new Response(
            JSON.stringify({ 
              error: data?.message || 'Failed to create transaction', 
              details: data,
              paradise_status: response.status 
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify(data),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Invalid action. Use: create, status, or health' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const corsHeaders = getCorsHeaders(req);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    let queryUrl: string;
    
    // If we have a transaction ID, query by ID
    if (transactionId) {
      console.log('Checking status for transaction:', transactionId);
      queryUrl = `${PARADISE_BASE_URL}/query.php?action=get_transaction&id=${transactionId}`;
    } else {
      // If we only have reference, search by external_id (reference)
      console.log('Searching transaction by reference:', reference);
      queryUrl = `${PARADISE_BASE_URL}/query.php?action=list_transactions&external_id=${reference}`;
    }

    console.log('Query URL:', queryUrl);

    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey, // Correct header according to documentation
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Status check response:', JSON.stringify(data));
    
    return new Response(
      JSON.stringify(data),
      { status: response.ok ? 200 : response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Status check error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check payment status' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
