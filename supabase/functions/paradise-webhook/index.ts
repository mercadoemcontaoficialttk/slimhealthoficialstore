import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// UTMify API configuration
const UTMIFY_API_URL = 'https://api.utmify.com.br/api-credentials/orders';

// Function to send conversion to UTMify
async function sendToUtmify(data: {
  orderId: string;
  platform: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  approvedAt?: string;
  customer: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
  };
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    priceInCents: number;
  }>;
  trackingParameters?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    src?: string;
    sck?: string;
  };
  isTest?: boolean;
}) {
  const utmifyToken = Deno.env.get('UTMIFY_API_TOKEN');
  
  if (!utmifyToken) {
    console.error('UTMIFY_API_TOKEN not configured');
    return { success: false, error: 'Token not configured' };
  }

  try {
    console.log('=== SENDING TO UTMIFY ===');
    console.log('Payload:', JSON.stringify(data, null, 2));

    const response = await fetch(UTMIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': utmifyToken,
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    console.log('UTMify Response Status:', response.status);
    console.log('UTMify Response:', responseText);

    if (!response.ok) {
      return { success: false, error: `UTMify error: ${response.status} - ${responseText}` };
    }

    return { success: true, response: responseText };
  } catch (error) {
    console.error('UTMify fetch error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Old format (expected)
interface LegacyWebhookPayload {
  event: string;
  data: {
    id: string;
    status: string;
    reference?: string;
    amount?: number;
    paidAt?: string;
  };
}

// Real Paradise Pags format
interface ParadiseWebhookPayload {
  transaction_id?: number | string;
  external_id?: string;
  status?: string;
  webhook_type?: string;
  amount?: number;
  paid_at?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
  };
  tracking?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    src?: string;
    sck?: string;
  };
  product?: {
    name?: string;
    hash?: string;
  };
  timestamp?: string;
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
    const rawBody = await req.text();
    console.log('=== PARADISE WEBHOOK RAW BODY ===');
    console.log(rawBody);
    
    const body = JSON.parse(rawBody);
    
    console.log('=== PARADISE WEBHOOK RECEIVED ===');
    console.log('Full payload:', JSON.stringify(body, null, 2));
    console.log('Timestamp:', new Date().toISOString());

    // Detect payload format and extract data
    let transactionId: string;
    let mappedStatus: string;
    let reference: string | undefined;
    let amount: number | undefined;
    let paidAt: string | undefined;
    let customer: ParadiseWebhookPayload['customer'] | undefined;
    let tracking: ParadiseWebhookPayload['tracking'] | undefined;
    let product: ParadiseWebhookPayload['product'] | undefined;
    let createdAt: string | undefined;

    // Check if it's the real Paradise format (flat structure with transaction_id)
    if (body.transaction_id !== undefined || body.webhook_type !== undefined) {
      // Real Paradise Pags format
      const paradisePayload = body as ParadiseWebhookPayload;
      
      transactionId = String(paradisePayload.transaction_id || '');
      reference = paradisePayload.external_id;
      amount = paradisePayload.amount;
      paidAt = paradisePayload.paid_at;
      customer = body.customer;
      tracking = body.tracking;
      product = body.product;
      createdAt = body.timestamp;

      // Map webhook_type to status
      const webhookType = paradisePayload.webhook_type || '';
      const rawStatus = (paradisePayload.status || '').toLowerCase();

      console.log('Detected Paradise format');
      console.log('webhook_type:', webhookType);
      console.log('raw status:', rawStatus);

      if (
        webhookType === 'QR_CODE_COPY_AND_PASTE_PAID' ||
        rawStatus === 'approved' ||
        rawStatus === 'paid'
      ) {
        mappedStatus = 'approved';
      } else if (
        webhookType === 'QR_CODE_COPY_AND_PASTE_CREATED' ||
        rawStatus === 'pending' ||
        rawStatus === 'waiting'
      ) {
        mappedStatus = 'pending';
      } else if (
        webhookType === 'QR_CODE_COPY_AND_PASTE_EXPIRED' ||
        rawStatus === 'expired'
      ) {
        mappedStatus = 'expired';
      } else if (
        rawStatus === 'failed' ||
        rawStatus === 'cancelled' ||
        rawStatus === 'refunded'
      ) {
        mappedStatus = 'failed';
      } else {
        mappedStatus = rawStatus || 'unknown';
      }
    } 
    // Legacy format (event + data structure)
    else if (body.event && body.data) {
      const legacyPayload = body as LegacyWebhookPayload;
      
      transactionId = legacyPayload.data.id;
      reference = legacyPayload.data.reference;
      amount = legacyPayload.data.amount;
      paidAt = legacyPayload.data.paidAt;

      console.log('Detected Legacy format');
      console.log('Event:', legacyPayload.event);

      switch (legacyPayload.event) {
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
          mappedStatus = legacyPayload.data.status?.toLowerCase() || 'unknown';
      }
    } 
    // Unknown format - try to extract what we can
    else {
      console.log('Unknown payload format, attempting to extract data...');
      transactionId = String(body.id || body.transaction_id || 'unknown');
      mappedStatus = (body.status || 'unknown').toLowerCase();
      reference = body.reference || body.external_id;
      amount = body.amount;
      paidAt = body.paid_at || body.paidAt;
      customer = body.customer;
      tracking = body.tracking;
      product = body.product;
      createdAt = body.timestamp;
    }

    console.log('=== PROCESSED DATA ===');
    console.log('Transaction ID:', transactionId);
    console.log('Mapped Status:', mappedStatus);
    console.log('Reference:', reference);
    console.log('Amount:', amount);

    // Initialize Supabase client for potential future DB storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Future: Store transaction status in database
      console.log('Supabase client initialized - ready for DB storage');
    }

    // Log successful processing
    console.log('=== WEBHOOK PROCESSED SUCCESSFULLY ===');
    console.log(`Transaction ${transactionId} status: ${mappedStatus}`);
    if (reference) {
      console.log(`Reference: ${reference}`);
    }
    if (amount) {
      console.log(`Amount: R$ ${(amount / 100).toFixed(2)}`);
    }
    if (paidAt) {
      console.log(`Paid at: ${paidAt}`);
    }

    // Send to UTMify if payment is approved
    // Send ALL status updates to UTMify for full visibility
    console.log('=== SENDING STATUS UPDATE TO UTMIFY ===');
    
    // Map our status to UTMify status format
    let utmifyStatus: string;
    let approvedAt: string | undefined;
    let refundedAt: string | undefined;
    
    switch (mappedStatus) {
      case 'approved':
        utmifyStatus = 'paid';
        approvedAt = paidAt || new Date().toISOString();
        break;
      case 'pending':
        utmifyStatus = 'waiting_payment';
        break;
      case 'expired':
        utmifyStatus = 'refused';
        break;
      case 'failed':
        utmifyStatus = 'refused';
        break;
      case 'refunded':
        utmifyStatus = 'refunded';
        refundedAt = new Date().toISOString();
        break;
      default:
        utmifyStatus = 'waiting_payment';
    }
    
    const utmifyPayload = {
      orderId: reference || transactionId,
      platform: 'SlimHealth',
      paymentMethod: 'pix',
      status: utmifyStatus,
      createdAt: createdAt || new Date().toISOString(),
      ...(approvedAt && { approvedAt }),
      ...(refundedAt && { refundedAt }),
      customer: {
        name: customer?.name,
        email: customer?.email,
        phone: customer?.phone,
        document: customer?.document,
      },
      products: [
        {
          id: product?.hash || 'mounjaro-5mg',
          name: product?.name || 'Mounjaro 5mg - SlimHealth',
          quantity: 1,
          priceInCents: amount || 0,
        },
      ],
      trackingParameters: {
        utm_source: tracking?.utm_source,
        utm_medium: tracking?.utm_medium,
        utm_campaign: tracking?.utm_campaign,
        utm_content: tracking?.utm_content,
        utm_term: tracking?.utm_term,
        src: tracking?.src,
        sck: tracking?.sck,
      },
      isTest: false,
    };

    const utmifyResult = await sendToUtmify(utmifyPayload);
    console.log('UTMify Result:', JSON.stringify(utmifyResult));

    // Return success response to Paradise with all extracted data
    // This allows the frontend to use the reference to update localStorage
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed',
        transactionId,
        reference,
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
