import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { trackPurchase } from '@/hooks/useTikTokPixel';
import { getTrackingDataForApi } from '@/hooks/useTrackingService';

interface Customer {
  name: string;
  email: string;
  document: string;
  phone: string;
}

interface TrackingParams {
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
}

const getTrackingParams = (productName?: string, funnelStep?: string): TrackingParams => {
  const trackingData = getTrackingDataForApi();
  return {
    ...trackingData,
    product_name: productName,
    funnel_step: funnelStep,
  };
};

export interface UseParadisePixReturn {
  isLoading: boolean;
  error: string | null;
  transactionId: string | null;
  qrCode: string | null;
  qrCodeBase64: string | null;
  paymentStatus: 'idle' | 'pending' | 'approved' | 'failed' | 'expired';
  createPixPayment: (amount: number, description: string, customer: Customer, reference?: string) => Promise<boolean>;
  createPixPaymentWithTracking: (amount: number, description: string, customer: Customer, reference: string, productName: string, funnelStep: string) => Promise<boolean>;
  checkPaymentStatus: () => Promise<string | null>;
  startPolling: (onApproved: () => void) => void;
  stopPolling: () => void;
  reset: () => void;
}

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

function parseErrorMessage(data: Record<string, unknown>): string {
  if (data?.validation_failed) {
    return String(data.error || 'Dados inválidos. Verifique CPF, telefone e e-mail.');
  }
  const msg = String(data?.error || data?.message || '');
  if (msg.includes('verifique os dados') || data?.paradise_status === 400) {
    return 'Dados do pagador foram rejeitados. Verifique CPF e telefone e tente novamente.';
  }
  return msg || 'Não foi possível gerar o QR Code. Tente novamente.';
}

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
  const transactionIdRef = useRef<string | null>(null);
  const currentReferenceRef = useRef<string | null>(null);

  // Inline helper — NOT a hook
  function applySuccessResponse(data: Record<string, unknown>, reference: string, amount: number) {
    const txId = String(data.transaction_id || data.id || '');
    const effectiveRef = String(data.id || reference);

    transactionIdRef.current = txId;
    currentReferenceRef.current = effectiveRef;

    setTransactionId(txId);
    setCurrentReference(effectiveRef);
    setQrCode(String(data.qr_code || data.pixCopiaECola || ''));

    const qrImg = data.qr_code_base64 || data.pixQrCode || null;
    setQrCodeBase64(qrImg ? String(qrImg) : null);

    setPaymentStatus('pending');

    storeTransaction(effectiveRef, {
      id: txId,
      reference: effectiveRef,
      status: 'pending',
      amount,
      createdAt: new Date().toISOString(),
    });
  }

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
      const trackingData = getTrackingParams('Mounjaro 5mg', 'main_product');

      const { data, error: invokeError } = await supabase.functions.invoke('paradise-pix', {
        body: {
          action: 'create',
          amount: Math.round(amount * 100),
          description,
          reference: txReference,
          customer,
          tracking: trackingData,
        },
      });

      if (invokeError) throw new Error(invokeError.message || 'Não foi possível conectar ao servidor de pagamento');
      if (data?.error) throw new Error(parseErrorMessage(data));
      if (!data?.transaction_id && !data?.qr_code) throw new Error('Resposta inválida do servidor. Tente novamente.');

      applySuccessResponse(data, txReference, Math.round(amount * 100));
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

  const createPixPaymentWithTracking = useCallback(async (
    amount: number,
    description: string,
    customer: Customer,
    reference: string,
    productName: string,
    funnelStep: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setPaymentStatus('idle');

    try {
      const trackingData = getTrackingParams(productName, funnelStep);

      const { data, error: invokeError } = await supabase.functions.invoke('paradise-pix', {
        body: {
          action: 'create',
          amount: Math.round(amount * 100),
          description,
          reference,
          customer,
          tracking: trackingData,
        },
      });

      if (invokeError) throw new Error(invokeError.message || 'Não foi possível conectar ao servidor de pagamento');
      if (data?.error) throw new Error(parseErrorMessage(data));
      if (!data?.transaction_id && !data?.qr_code) throw new Error('Resposta inválida do servidor. Tente novamente.');

      applySuccessResponse(data, reference, Math.round(amount * 100));
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
    const txId = transactionIdRef.current || transactionId;
    const ref = currentReferenceRef.current || currentReference;

    if (ref) {
      const storedTx = getTransactionByReference(ref);
      if (storedTx && storedTx.status === 'approved') {
        setPaymentStatus('approved');
        return 'approved';
      }
    }

    if (!txId) return null;

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('paradise-pix', {
        body: { action: 'status', id: txId, reference: ref },
      });

      if (invokeError || data?.error) {
        console.warn('Status check returned error:', data?.error || invokeError?.message);
        return null;
      }

      // Robust status extraction: check multiple possible response shapes
      const rawStatus = (
        data.status ||
        data.data?.status ||
        data.transaction?.status ||
        data.result?.status ||
        ''
      );
      const status = String(rawStatus).toLowerCase();
      console.log('Payment status response:', JSON.stringify(data), '→ parsed status:', status);

      if (status === 'approved' || status === 'paid' || status === 'completed' || status === 'confirmed') {
        setPaymentStatus('approved');
        if (ref) {
          updateTransactionStatus(ref, 'approved');
          const storedTx = getTransactionByReference(ref);
          if (storedTx) trackPurchase(storedTx.amount / 100, 'BRL', ref);
        }
        return 'approved';
      } else if (status === 'failed' || status === 'cancelled' || status === 'refunded') {
        setPaymentStatus('failed');
        if (ref) updateTransactionStatus(ref, 'failed');
        return 'failed';
      } else if (status === 'expired') {
        setPaymentStatus('expired');
        if (ref) updateTransactionStatus(ref, 'expired');
        return 'expired';
      }

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
    onApprovedCallback.current = onApproved;

    if (pollingInterval.current) clearInterval(pollingInterval.current);

    checkPaymentStatus().then((status) => {
      if (status === 'approved') {
        stopPolling();
        onApprovedCallback.current?.();
      }
    });

    pollingInterval.current = setInterval(async () => {
      const status = await checkPaymentStatus();
      if (status === 'approved') {
        stopPolling();
        onApprovedCallback.current?.();
      } else if (status === 'failed' || status === 'expired') {
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
    transactionIdRef.current = null;
    currentReferenceRef.current = null;
  }, [stopPolling]);

  useEffect(() => {
    return () => { stopPolling(); };
  }, [stopPolling]);

  return {
    isLoading,
    error,
    transactionId,
    qrCode,
    qrCodeBase64,
    paymentStatus,
    createPixPayment,
    createPixPaymentWithTracking,
    checkPaymentStatus,
    startPolling,
    stopPolling,
    reset,
  };
}
