 import { useState, useEffect } from "react";
 import { useTrackingService } from "@/hooks/useTrackingService";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Copy, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useParadisePix } from "@/hooks/useParadisePix";
import slimHealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

interface Pedido {
  produto: {
    quantidade: number;
    subtotal: number;
  };
  frete: {
    tipo: string;
    nome: string;
    prazo: string;
    valor: number;
  } | null;
  bumps: Array<{
    id: string;
    nome: string;
    precoPromocional: number;
  }>;
  valorBumps: number;
  total: number;
  metodoPagamento: string;
}

interface DadosPessoais {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

const PixPage = () => {
  const navigate = useNavigate();
   
   // Capture UTM params with robust tracking service
   useTrackingService();
 
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos
  const [paymentInitialized, setPaymentInitialized] = useState(false);

  const {
    isLoading,
    error,
    qrCode,
    qrCodeBase64,
    paymentStatus,
    createPixPayment,
     createPixPaymentWithTracking,
    startPolling,
    reset,
  } = useParadisePix();

  // Load order and customer data
  useEffect(() => {
    const pedidoSalvo = localStorage.getItem('pedido');
    const dadosSalvos = localStorage.getItem('dadosPessoais');
    
    if (pedidoSalvo) {
      setPedido(JSON.parse(pedidoSalvo));
    }
    if (dadosSalvos) {
      setDadosPessoais(JSON.parse(dadosSalvos));
    }
  }, []);

  // Create PIX payment when data is ready
  useEffect(() => {
    if (pedido && dadosPessoais && !paymentInitialized && !isLoading) {
      console.log('=== INITIALIZING PIX PAYMENT ===');
      console.log('Pedido:', pedido);
      console.log('Dados Pessoais:', dadosPessoais);
      
      setPaymentInitialized(true);
      
      const customer = {
        name: dadosPessoais.nome,
        email: dadosPessoais.email,
        document: dadosPessoais.cpf,
        phone: dadosPessoais.telefone,
      };

      const orderReference = `pedido_${Date.now()}`;
      console.log('Order Reference:', orderReference);

       createPixPaymentWithTracking(
         pedido.total,
         'Mounjaro 5mg - SlimHealth',
        customer,
         orderReference,
         'Mounjaro 5mg - SlimHealth',
         'main_product'
      ).then((success) => {
        console.log('PIX payment created:', success);
        if (success) {
          console.log('Starting polling for payment confirmation...');
          startPolling(() => {
            console.log('🎉 PAYMENT APPROVED CALLBACK TRIGGERED!');
            toast.success("Pagamento confirmado!");
            console.log('Navigating to /upsell1...');
            navigate('/upsell1');
          });
        }
      });
    }
  }, [pedido, dadosPessoais, paymentInitialized, isLoading, createPixPayment, startPolling, navigate]);

  // FALLBACK: Watch paymentStatus and redirect if approved
  useEffect(() => {
    if (paymentStatus === 'approved') {
      console.log('🔄 FALLBACK: paymentStatus is approved, redirecting to /upsell1');
      toast.success("Pagamento confirmado!");
      navigate('/upsell1');
    }
  }, [paymentStatus, navigate]);

  // Timer countdown
  useEffect(() => {
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
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPix = async () => {
    if (!qrCode) {
      toast.error("Código PIX não disponível");
      return;
    }
    try {
      await navigator.clipboard.writeText(qrCode);
      toast.success("Código PIX copiado!");
    } catch {
      toast.error("Erro ao copiar código");
    }
  };

  const handleRetry = () => {
    reset();
    setPaymentInitialized(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const totalItens = pedido 
    ? pedido.produto.quantidade + pedido.bumps.length 
    : 0;

  const valorTotal = pedido?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/confirmacao')}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Pagamento PIX</h1>
          </div>
          <div className="flex items-center gap-1">
            <img src={slimHealthLogo} alt="SlimHealth" className="h-7 w-auto opacity-70" />
            <span className="text-gray-400 text-sm">+</span>
            <img src={cimedLogo} alt="CIMED" className="h-5 w-auto opacity-70" />
          </div>
        </div>
        
        {/* Progress Bar - 100% */}
        <div className="h-1 bg-slate-200 mt-3">
          <div className="h-full w-full bg-rose-500" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Card Valor a Pagar */}
        <div className="bg-gradient-to-b from-rose-400 to-rose-500 rounded-2xl p-6 text-center text-white shadow-lg">
          <p className="text-sm font-medium opacity-90 uppercase tracking-wide">Valor a Pagar</p>
          <p className="text-4xl font-bold mt-2">{formatCurrency(valorTotal)}</p>
          <p className="text-sm mt-1 opacity-90">
            {totalItens} {totalItens === 1 ? 'item' : 'itens'}
          </p>
        </div>

        {/* Card QR Code */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-center text-gray-700 font-medium mb-4">
            Escaneie o QR Code com o app do seu banco
          </p>

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
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center mb-4 w-full">
                <p className="font-medium">Erro ao gerar pagamento</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <Button onClick={handleRetry} variant="outline">
                Tentar novamente
              </Button>
            </div>
          )}

          {/* QR Code */}
          {!isLoading && !error && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-48 h-48 bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {qrCodeBase64 ? (
                    <img 
                      src={
                        qrCodeBase64.startsWith('data:') 
                          ? qrCodeBase64 
                          : qrCodeBase64.startsWith('http') 
                            ? qrCodeBase64 
                            : `data:image/png;base64,${qrCodeBase64}`
                      } 
                      alt="QR Code PIX" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400 p-4">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Carregando...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Divisor */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-500">ou copie o código</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Botão Copiar */}
              <Button
                onClick={handleCopyPix}
                disabled={!qrCode}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                Copiar código PIX
              </Button>

              {/* Código PIX truncado */}
              {qrCode && (
                <p className="text-xs text-gray-400 text-center mt-3 break-all px-4 line-clamp-2">
                  {qrCode}
                </p>
              )}
            </>
          )}
        </div>

        {/* Card Expiração */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <span className="text-amber-700 font-medium">
            O PIX expira em: <span className="font-bold">{formatTime(timeLeft)}</span>
          </span>
        </div>

        {/* Aguardando confirmação */}
        {paymentStatus === 'pending' && (
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Aguardando confirmação do pagamento...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PixPage;
