import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { trackPurchase } from '@/hooks/useTikTokPixel';

interface Customer {
  name: string;
  email: string;
  document: string;
  phone: string;
}

interface UseParadisePixReturn {
  isLoading: boolean;
  error: string | null;
  transactionId: string | null;
  qrCode: string | null;
  qrCodeBase64: string | null;
  paymentStatus: 'idle' | 'pending' | 'approved' | 'failed' | 'expired';
  createPixPayment: (amount: number, description: string, customer: Customer, reference?: string) => Promise<boolean>;
  checkPaymentStatus: () => Promise<string | null>;
  startPolling: (onApproved: () => void) => void;
  stopPolling: () => void;
  reset: () => void;
}

// localStorage key for transaction storage
const TRANSACTIONS_STORAGE_KEY = 'paradise_transactions';

interface StoredTransaction {
  id: string;
  reference: string;
  status: string;
  amount: number;
  createdAt: string;
}

const getStoredTransactions = (): Record<string, StoredTransaction> => {
  try {
    const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const storeTransaction = (reference: string, transaction: StoredTransaction) => {
  const transactions = getStoredTransactions();
  transactions[reference] = transaction;
  localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
};

const updateTransactionStatus = (reference: string, status: string) => {
  const transactions = getStoredTransactions();
  if (transactions[reference]) {
    transactions[reference].status = status;
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  }
};

const getTransactionByReference = (reference: string): StoredTransaction | null => {
  const transactions = getStoredTransactions();
  return transactions[reference] || null;
};

export function useParadisePix(): UseParadisePixReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'approved' | 'failed' | 'expired'>('idle');
  const [currentReference, setCurrentReference] = useState<string | null>(null);
  
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const onApprovedCallback = useRef<(() => void) | null>(null);
  
  // CRITICAL: Refs to avoid stale closure issues in polling
  const transactionIdRef = useRef<string | null>(null);
  const currentReferenceRef = useRef<string | null>(null);

  const createPixPayment = useCallback(async (
    amount: number,
    description: string,
    customer: Customer,
    reference?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setPaymentStatus('idle');

    const txReference = reference || `order_${Date.now()}`;

    try {
      console.log('Creating PIX payment via supabase.functions.invoke...');
      
      const { data, error: invokeError } = await supabase.functions.invoke('paradise-pix', {
        body: {
          action: 'create',
          amount: Math.round(amount * 100), // Convert to cents
          description,
          reference: txReference,
          customer,
        },
      });

      if (invokeError) {
        console.error('Invoke error:', invokeError);
        throw new Error(invokeError.message || 'Não foi possível conectar à função de pagamento');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      console.log('PIX payment created:', data);

      // Paradise API returns transaction_id as the ID
      const txId = data.transaction_id || data.id;
      
      // CRITICAL: Update refs IMMEDIATELY (synchronous) before any async operation
      transactionIdRef.current = txId;
      currentReferenceRef.current = txReference;
      console.log('🔧 Refs updated IMMEDIATELY - txId:', txId, 'ref:', txReference);
      
      // Then update state for UI
      setTransactionId(txId);
      setCurrentReference(txReference);
      
      // qr_code contains the PIX copy-paste code
      setQrCode(data.qr_code || data.pixCopiaECola);
      
      // qr_code_base64 from Paradise is actually a URL to the QR code image, not base64
      // So we store it directly as-is
      const qrCodeImage = data.qr_code_base64 || data.pixQrCode;
      setQrCodeBase64(qrCodeImage);
      
      console.log('QR Code URL/Base64:', qrCodeImage);
      setPaymentStatus('pending');
      // Store transaction in localStorage for webhook sync
      storeTransaction(txReference, {
        id: txId,
        reference: txReference,
        status: 'pending',
        amount: Math.round(amount * 100),
        createdAt: new Date().toISOString(),
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar pagamento';
      setError(errorMessage);
      setPaymentStatus('failed');
      console.error('Error creating PIX payment:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkPaymentStatus = useCallback(async (): Promise<string | null> => {
    // CRITICAL: Read from refs first to avoid stale closure issues
    const txId = transactionIdRef.current || transactionId;
    const ref = currentReferenceRef.current || currentReference;
    
    console.log('=== CHECKING PAYMENT STATUS ===');
    console.log('Transaction ID (ref):', transactionIdRef.current);
    console.log('Transaction ID (state):', transactionId);
    console.log('Using txId:', txId);
    console.log('Current Reference (ref):', currentReferenceRef.current);
    console.log('Current Reference (state):', currentReference);
    console.log('Using ref:', ref);
    
    // First check localStorage for webhook-updated status
    if (ref) {
      const storedTx = getTransactionByReference(ref);
      console.log('Stored transaction:', storedTx);
      
      if (storedTx && storedTx.status === 'approved') {
        console.log('✅ Found APPROVED status in localStorage from webhook!');
        setPaymentStatus('approved');
        return 'approved';
      }
    }

    if (!txId) {
      console.log('❌ No transaction ID available yet (both ref and state are null)');
      return null;
    }

    try {
      console.log('Querying Paradise API for status with txId:', txId);
      
      const { data, error: invokeError } = await supabase.functions.invoke('paradise-pix', {
        body: {
          action: 'status',
          id: txId,
          reference: ref,
        },
      });

      console.log('Status API response:', data);

      if (invokeError) {
        console.error('Status check invoke error:', invokeError);
        return null;
      }

      if (data?.error) {
        console.error('Status check error:', data.error);
        return null;
      }

      const status = data.status?.toLowerCase();
      console.log('Parsed status:', status);
      
      if (status === 'approved' || status === 'paid') {
        console.log('✅ Payment APPROVED via API!');
        setPaymentStatus('approved');
        if (ref) {
          updateTransactionStatus(ref, 'approved');
          // Track Purchase event on TikTok Pixel
          const storedTx = getTransactionByReference(ref);
          if (storedTx) {
            trackPurchase(storedTx.amount / 100, 'BRL', ref);
          }
        }
        return 'approved';
      } else if (status === 'failed' || status === 'cancelled' || status === 'refunded') {
        console.log('❌ Payment FAILED');
        setPaymentStatus('failed');
        if (ref) {
          updateTransactionStatus(ref, 'failed');
        }
        return 'failed';
      } else if (status === 'expired') {
        console.log('⏰ Payment EXPIRED');
        setPaymentStatus('expired');
        if (ref) {
          updateTransactionStatus(ref, 'expired');
        }
        return 'expired';
      }
      
      console.log('Status still pending:', status);
      return status;
    } catch (err) {
      console.error('Error checking payment status:', err);
      return null;
    }
  }, [transactionId, currentReference]);

  const stopPolling = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  }, []);

  const startPolling = useCallback((onApproved: () => void) => {
    console.log('=== STARTING PAYMENT POLLING ===');
    onApprovedCallback.current = onApproved;
    
    // Clear existing interval
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }

    // Do an immediate check first
    checkPaymentStatus().then((status) => {
      console.log('Immediate status check result:', status);
      if (status === 'approved') {
        console.log('🎉 Payment already approved! Calling callback...');
        stopPolling();
        onApprovedCallback.current?.();
      }
    });

    // Then poll every 5 seconds
    pollingInterval.current = setInterval(async () => {
      console.log('Polling check...');
      const status = await checkPaymentStatus();
      
      if (status === 'approved') {
        console.log('🎉 Payment approved during polling! Calling callback...');
        stopPolling();
        onApprovedCallback.current?.();
      } else if (status === 'failed' || status === 'expired') {
        console.log('Payment failed/expired, stopping polling');
        stopPolling();
      }
    }, 5000);
  }, [checkPaymentStatus, stopPolling]);

  const reset = useCallback(() => {
    stopPolling();
    setIsLoading(false);
    setError(null);
    setTransactionId(null);
    setCurrentReference(null);
    setQrCode(null);
    setQrCodeBase64(null);
    setPaymentStatus('idle');
    // CRITICAL: Also clear refs to avoid leaking to new payment attempts
    transactionIdRef.current = null;
    currentReferenceRef.current = null;
    console.log('🔄 Reset complete - refs and state cleared');
  }, [stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    isLoading,
    error,
    transactionId,
    qrCode,
    qrCodeBase64,
    paymentStatus,
    createPixPayment,
    checkPaymentStatus,
    startPolling,
    stopPolling,
    reset,
  };
}
