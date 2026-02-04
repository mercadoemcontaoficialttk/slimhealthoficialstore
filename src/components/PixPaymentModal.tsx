import { useEffect, useState } from "react";
import { X, Copy, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import tiktokLogo from "@/assets/upsell/tiktok-shop.png";

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  qrCode: string | null;
  qrCodeBase64: string | null;
  isLoading: boolean;
  paymentStatus: 'idle' | 'pending' | 'approved' | 'failed' | 'expired';
  error: string | null;
  onRetry?: () => void;
}

export function PixPaymentModal({
  isOpen,
  onClose,
  title,
  amount,
  qrCode,
  qrCodeBase64,
  isLoading,
  paymentStatus,
  error,
  onRetry,
}: PixPaymentModalProps) {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(900);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPix = async () => {
    if (!qrCode) return;
    try {
      await navigator.clipboard.writeText(qrCode);
      toast.success("Código PIX copiado!");
    } catch {
      toast.error("Erro ao copiar código");
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between">
          <div className="w-8" />
          <img src={tiktokLogo} alt="TikTok Shop" className="h-8 w-auto" />
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Value */}
          <div className="text-center mb-4">
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(amount)}</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
              <p className="text-gray-600">Gerando QR Code...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-4">
                <p className="font-medium">Erro ao gerar pagamento</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              {onRetry && (
                <Button onClick={onRetry} variant="outline">
                  Tentar novamente
                </Button>
              )}
            </div>
          )}

          {/* QR Code */}
          {!isLoading && !error && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-48 h-48 bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {qrCodeBase64 ? (
                    <img 
                      src={qrCodeBase64.startsWith('data:') ? qrCodeBase64 : `data:image/png;base64,${qrCodeBase64}`} 
                      alt="QR Code PIX" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400 p-4">
                      <p className="text-sm">QR Code não disponível</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Copy Button */}
              <Button
                onClick={handleCopyPix}
                disabled={!qrCode}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                Copiar código PIX
              </Button>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 mt-4 text-amber-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  O PIX expira em: <span className="font-bold">{formatTime(timeLeft)}</span>
                </span>
              </div>

              {/* Waiting confirmation */}
              {paymentStatus === 'pending' && (
                <div className="flex items-center justify-center gap-2 mt-2 text-amber-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Aguardando confirmação...</span>
                </div>
              )}

              {/* PIX code truncated */}
              {qrCode && (
                <p className="text-xs text-gray-400 text-center mt-4 break-all line-clamp-2 px-2">
                  {qrCode}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
