import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Copy, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

const PixPage = () => {
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos

  // Placeholder PIX code - será substituído pela integração com gateway
  const pixCode = "00020101021226940014br.gov.bcb.pix2572qrcodespix.sejaefi.com.br/v2/cobfc73d8f1cc9a469c7b33e0e5d0e08a675204000053039865802BR5925SLIMHEALTH COMERCIO DE PRO6009SAO PAULO62070503***6304";

  useEffect(() => {
    const pedidoSalvo = localStorage.getItem('pedido');
    if (pedidoSalvo) {
      setPedido(JSON.parse(pedidoSalvo));
    }
  }, []);

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
    try {
      await navigator.clipboard.writeText(pixCode);
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

  // Calcular total de itens (produto + bumps)
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

          {/* QR Code Placeholder */}
          <div className="flex justify-center mb-4">
            <div className="w-48 h-48 bg-gray-100 border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-32 h-32 bg-gray-200 rounded grid grid-cols-5 grid-rows-5 gap-1 p-2">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'}`}
                    />
                  ))}
                </div>
                <p className="text-xs mt-2">QR Code</p>
              </div>
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
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Copy className="w-5 h-5" />
            Copiar código PIX
          </Button>

          {/* Código PIX truncado */}
          <p className="text-xs text-gray-400 text-center mt-3 break-all px-4 line-clamp-2">
            {pixCode}
          </p>
        </div>

        {/* Card Expiração */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          <span className="text-amber-700 font-medium">
            O PIX expira em: <span className="font-bold">{formatTime(timeLeft)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PixPage;
