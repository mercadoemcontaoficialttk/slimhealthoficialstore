import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  // IMPORTANT: must include every header the browser may send in preflight
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
};

interface WebhookPayload {
  event: string;
  data: {
    id: string;
    status: string;
    reference?: string;
    amount?: number;
    paidAt?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body: WebhookPayload = await req.json();
    
    console.log('=== PARADISE WEBHOOK RECEIVED ===');
    console.log('Event:', body.event);
    console.log('Data:', JSON.stringify(body.data));
    console.log('Timestamp:', new Date().toISOString());

    // Validate payload structure
    if (!body.event || !body.data || !body.data.id) {
      console.error('Invalid payload structure:', JSON.stringify(body));
      return new Response(
        JSON.stringify({ error: 'Invalid payload structure' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { event, data } = body;
    const { id, status, reference, amount, paidAt } = data;

    // Map Paradise events to our status
    let mappedStatus: string;
    switch (event) {
      case 'transaction.paid':
        mappedStatus = 'approved';
        break;
      case 'transaction.failed':
        mappedStatus = 'failed';
        break;
      case 'transaction.expired':
        mappedStatus = 'expired';
        break;
      default:
        console.log('Unhandled event type:', event);
        mappedStatus = status?.toLowerCase() || 'unknown';
    }

    console.log('Mapped status:', mappedStatus);
    console.log('Transaction ID:', id);
    console.log('Reference:', reference);

    // Initialize Supabase client for potential future DB storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Future: Store transaction status in database
      // For now, we just log it for monitoring
      console.log('Supabase client initialized - ready for DB storage');
    }

    // Log successful processing
    console.log('=== WEBHOOK PROCESSED SUCCESSFULLY ===');
    console.log(`Transaction ${id} status: ${mappedStatus}`);
    if (reference) {
      console.log(`Reference: ${reference}`);
    }
    if (amount) {
      console.log(`Amount: R$ ${(amount / 100).toFixed(2)}`);
    }
    if (paidAt) {
      console.log(`Paid at: ${paidAt}`);
    }

    // Return success response to Paradise
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed',
        transactionId: id,
        status: mappedStatus
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('=== WEBHOOK ERROR ===');
    console.error('Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
