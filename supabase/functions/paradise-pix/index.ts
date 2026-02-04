import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreatePixRequest {
  amount: number; // em centavos
  description: string;
  reference: string;
  customer: {
    name: string;
    email: string;
    document: string;
    phone: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PARADISE_API_KEY = Deno.env.get('PARADISE_API_KEY');
    
    if (!PARADISE_API_KEY) {
      throw new Error('PARADISE_API_KEY not configured');
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // GET - Check payment status
    if (req.method === 'GET' && action === 'status') {
      const transactionId = url.searchParams.get('id');
      
      if (!transactionId) {
        return new Response(
          JSON.stringify({ error: 'Transaction ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch(`https://api.paradisepag.com/api/v1/transaction/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': PARADISE_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      return new Response(
        JSON.stringify(data),
        { status: response.ok ? 200 : response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST - Create PIX transaction
    if (req.method === 'POST') {
      const body: CreatePixRequest = await req.json();

      // Validate required fields
      if (!body.amount || !body.description || !body.customer) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: amount, description, customer' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Prepare payload for Paradise API
      const payload = {
        amount: body.amount,
        paymentMethod: 'pix',
        description: body.description,
        reference: body.reference || `ref_${Date.now()}`,
        source: 'api_externa',
        customer: {
          name: body.customer.name,
          email: body.customer.email,
          document: body.customer.document.replace(/\D/g, ''), // Remove non-digits
          phone: body.customer.phone.replace(/\D/g, ''), // Remove non-digits
        },
      };

      console.log('Creating PIX transaction with payload:', JSON.stringify(payload));

      const response = await fetch('https://api.paradisepag.com/api/v1/transaction', {
        method: 'POST',
        headers: {
          'Authorization': PARADISE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      console.log('Paradise API response:', JSON.stringify(data));

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to create transaction', details: data }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Edge function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
