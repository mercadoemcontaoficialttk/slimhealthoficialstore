import { useState, useEffect } from "react";
import { CheckCircle, Circle, Truck, MapPin, Package, Shield, Check } from "lucide-react";
import { format, addDays, addBusinessDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import tiktokLogo from "@/assets/upsell/tiktok-shop.png";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

interface TimelineStep {
  id: number;
  label: string;
  status: 'completed' | 'current' | 'pending';
}

const RastreioPage = () => {
  
  // Order data from localStorage
  const [orderNumber, setOrderNumber] = useState("");
  const [endereco, setEndereco] = useState<any>({});
  const [frete, setFrete] = useState<any>({});
  const [pedido, setPedido] = useState<any>({});
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);

  // Timeline steps
  const timelineSteps: TimelineStep[] = [
    { id: 1, label: "Pedido recebido", status: 'completed' },
    { id: 2, label: "Separando produtos", status: 'current' },
    { id: 3, label: "Enviado", status: 'pending' },
    { id: 4, label: "Em trânsito", status: 'pending' },
    { id: 5, label: "Entregue", status: 'pending' },
  ];

  useEffect(() => {
    // Get or generate order number
    let storedOrderNumber = localStorage.getItem('orderNumber');
    if (!storedOrderNumber) {
      storedOrderNumber = `#TK${Math.floor(100000 + Math.random() * 900000)}`;
      localStorage.setItem('orderNumber', storedOrderNumber);
    }
    setOrderNumber(storedOrderNumber);

    // Get order data
    const enderecoData = JSON.parse(localStorage.getItem('endereco') || '{}');
    const freteData = JSON.parse(localStorage.getItem('frete') || '{}');
    const pedidoData = JSON.parse(localStorage.getItem('pedido') || '{}');
    
    setEndereco(enderecoData);
    setFrete(freteData);
    setPedido(pedidoData);

    // Calculate delivery date based on shipping method
    const today = new Date();
    let estimatedDate: Date;
    
    if (freteData.id === 'sedex') {
      // SEDEX 12: +1 day
      estimatedDate = addDays(today, 1);
    } else if (freteData.id === 'jadlog') {
      // JADLOG: +5 business days
      estimatedDate = addBusinessDays(today, 5);
    } else {
      // Frete Grátis (FULL): +10-12 days
      estimatedDate = addDays(today, 11);
    }
    
    setDeliveryDate(estimatedDate);
  }, []);

  const getShippingLabel = () => {
    if (frete.id === 'sedex') return 'SEDEX 12';
    if (frete.id === 'jadlog') return 'JADLOG';
    return 'Frete Grátis (FULL)';
  };

  const formatPrice = (price: number) => {
    return price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'R$ 0,00';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex justify-center border-b border-gray-100">
        <img src={tiktokLogo} alt="TikTok Shop" className="h-10 w-auto" />
      </div>

      <div className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-md">
          {/* Main Container */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 space-y-5">
            
            {/* Card 1 - Confirmation (Green Highlight) */}
            <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-500 p-6 text-center">
              {/* 3D Icon with pulse */}
              <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center mx-auto mb-5
                bg-gradient-to-br from-emerald-400 to-emerald-600
                shadow-[0_8px_24px_rgba(16,185,129,0.4)]
                animate-pulse">
                <CheckCircle className="w-9 h-9 text-white" />
              </div>
              
              <h1 className="text-2xl font-extrabold text-emerald-600 mb-3">
                Pedido Confirmado!
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Seu pedido <span className="font-bold text-emerald-600">{orderNumber}</span> foi recebido e está sendo processado com carinho.
              </p>
            </div>

            {/* Card 2 - Timeline */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
              <h2 className="font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-500" />
                Status do Pedido
              </h2>
              
              <div className="relative pl-4">
                {timelineSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3 relative">
                    {/* Connector line */}
                    {index < timelineSteps.length - 1 && (
                      <div className={`absolute left-[11px] top-6 w-0.5 h-8 ${
                        step.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-200'
                      }`} />
                    )}
                    
                    {/* Status icon */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === 'completed' 
                        ? 'bg-emerald-500' 
                        : step.status === 'current'
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-gray-200'
                    }`}>
                      {step.status === 'completed' && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                      {step.status === 'current' && (
                        <Circle className="w-3 h-3 text-white fill-white" />
                      )}
                    </div>
                    
                    {/* Step label */}
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${
                        step.status === 'pending' ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        {step.label}
                      </p>
                      {step.status === 'current' && (
                        <span className="inline-block mt-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                          Em andamento
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3 - Delivery Estimate */}
            <div className="bg-blue-50 rounded-2xl border-l-4 border-blue-500 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1a1a2e] mb-1">
                    Previsão de Entrega
                  </h2>
                  <p className="text-lg font-bold text-blue-600">
                    {deliveryDate 
                      ? format(deliveryDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      : 'Calculando...'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Via {getShippingLabel()}
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 - Delivery Address */}
            <div className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-[#1a1a2e] mb-1">
                    Endereço de Entrega
                  </h2>
                  {endereco.rua ? (
                    <>
                      <p className="text-sm text-gray-600">
                        {endereco.rua}, {endereco.numero}
                        {endereco.complemento && ` - ${endereco.complemento}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {endereco.bairro} - {endereco.cidade}/{endereco.uf}
                      </p>
                      <p className="text-sm text-gray-500">
                        CEP: {endereco.cep}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Endereço não disponível</p>
                  )}
                </div>
              </div>
            </div>

            {/* Card 5 - Order Summary */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
              <h2 className="font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-500" />
                Resumo do Pedido
              </h2>
              
              <div className="space-y-2 text-sm">
                {/* Produto principal */}
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Mounjaro 5mg {pedido.produto?.quantidade ? `x ${pedido.produto.quantidade}` : (pedido.quantidade ? `x ${pedido.quantidade}` : '')}
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatPrice(pedido.produto?.subtotal || pedido.subtotal || 0)}
                  </span>
                </div>

                {/* Bumps - se existirem */}
                {pedido.bumps?.map((bump: any) => (
                  <div key={bump.id} className="flex justify-between">
                    <span className="text-gray-600">{bump.nome}</span>
                    <span className="font-medium text-gray-800">
                      {formatPrice(bump.precoPromocional)}
                    </span>
                  </div>
                ))}

                {/* Frete */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete ({getShippingLabel()})</span>
                  <span className="font-medium text-gray-800">
                    {frete.valor === 0 ? 'Grátis' : formatPrice(frete.valor || 0)}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 my-3" />
                
                <div className="flex justify-between">
                  <span className="font-bold text-[#1a1a2e]">Total</span>
                  <span className="font-bold text-emerald-600 text-lg">
                    {formatPrice(pedido.total || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-xl p-4">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600 font-medium">
                Pagamento 100% seguro e confirmado
              </span>
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
    </div>
  );
};

export default RastreioPage;
