import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Minus, Plus, Lock, ShieldCheck, Check } from "lucide-react";
 import { useTrackingService } from "@/hooks/useTrackingService";
import foto1 from "@/assets/mounjaro/foto1.png";
import canetasImg from "@/assets/bumps/canetas.webp";
import kitTransporteImg from "@/assets/bumps/kit-transporte.webp";
import aulaPlayImg from "@/assets/bumps/aula-play.jpg";
import pixLogo from "@/assets/pix-logo.png";
import slimHealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";
import anvisaLogo from "@/assets/anvisa-logo.png";
import govbrLogo from "@/assets/govbr-logo.png";

const PRECO_UNITARIO = 67.23;

interface DadosPessoais {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  quantidade: number;
}

interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

interface Frete {
  tipo: string;
  nome: string;
  prazo: string;
  valor: number;
}

interface OrderBump {
  id: string;
  nome: string;
  descricao: string;
  precoOriginal: number;
  precoPromocional: number;
  desconto: string;
  imagem: string;
  badge?: string;
}

const ConfirmacaoPage = () => {
   // Capture tracking
   useTrackingService();
   
  const navigate = useNavigate();
  
  // Recuperar dados do localStorage
  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais | null>(null);
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [frete, setFrete] = useState<Frete | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [bumpsSelecionados, setBumpsSelecionados] = useState<string[]>([]);
  const [metodoPagamento, setMetodoPagamento] = useState("pix");

  // Order Bumps
  const orderBumps: OrderBump[] = [
    {
      id: 'canetas',
      nome: '+2 Canetas Aplicadoras Premium',
      descricao: 'Continue seu tratamento sem interrupções',
      precoOriginal: 129.90,
      precoPromocional: 89.90,
      desconto: '-31%',
      imagem: canetasImg,
      badge: 'MAIS VENDIDO'
    },
    {
      id: 'kit',
      nome: 'Kit Transporte Refrigerado',
      descricao: 'Bolsa térmica para levar aonde for',
      precoOriginal: 49.90,
      precoPromocional: 29.90,
      desconto: '-40%',
      imagem: kitTransporteImg
    },
    {
      id: 'aula',
      nome: 'Aula Exclusiva de Aplicação',
      descricao: 'Aprenda a aplicar com um profissional da área',
      precoOriginal: 39.90,
      precoPromocional: 19.90,
      desconto: '-50%',
      imagem: aulaPlayImg
    }
  ];

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('dadosPessoais');
    const enderecoSalvo = localStorage.getItem('endereco');
    const freteSalvo = localStorage.getItem('frete');

    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      setDadosPessoais(dados);
      setQuantidade(dados.quantidade || 1);
    }
    if (enderecoSalvo) {
      setEndereco(JSON.parse(enderecoSalvo));
    }
    if (freteSalvo) {
      setFrete(JSON.parse(freteSalvo));
    }
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleQuantityChange = (delta: number) => {
    setQuantidade(prev => {
      const newQtd = Math.max(1, prev + delta);
      // Atualizar localStorage
      if (dadosPessoais) {
        const updated = { ...dadosPessoais, quantidade: newQtd };
        localStorage.setItem('dadosPessoais', JSON.stringify(updated));
      }
      return newQtd;
    });
  };

  const toggleBump = (bumpId: string) => {
    setBumpsSelecionados(prev => 
      prev.includes(bumpId) 
        ? prev.filter(id => id !== bumpId)
        : [...prev, bumpId]
    );
  };

  // Cálculos
  const subtotalProduto = PRECO_UNITARIO * quantidade;
  const valorFrete = frete?.valor || 0;
  const valorBumps = orderBumps
    .filter(bump => bumpsSelecionados.includes(bump.id))
    .reduce((acc, bump) => acc + bump.precoPromocional, 0);
  const total = subtotalProduto + valorFrete + valorBumps;

  const handlePagar = () => {
    // Salvar pedido completo
    localStorage.setItem('pedido', JSON.stringify({
      produto: { quantidade, subtotal: subtotalProduto },
      frete,
      bumps: orderBumps.filter(b => bumpsSelecionados.includes(b.id)),
      valorBumps,
      total,
      metodoPagamento
    }));
    // Navegar para página de pagamento PIX
    navigate("/pix");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-screen-sm mx-auto px-4">
          <div className="h-14 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900 flex-1">Confirmação</h1>
            
            {/* Logos */}
            <div className="flex items-center gap-1 opacity-70">
              <img src={slimHealthLogo} alt="SlimHealth" className="h-7 w-auto" />
              <span className="text-slate-400 text-xs">+</span>
              <img src={cimedLogo} alt="CIMED" className="h-5 w-auto" />
            </div>
          </div>
        </div>
        {/* Progress Bar - 100% */}
        <div className="h-1 bg-slate-200">
          <div className="h-full w-full bg-rose-500" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-sm mx-auto w-full pb-36">
        {/* Itens do pedido */}
        <section className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Itens do pedido</h2>
          
          <div className="flex items-center gap-3">
            {/* Product Image */}
            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100">
              <img src={foto1} alt="Mounjaro" className="w-full h-full object-contain" />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-slate-900 line-clamp-1">
                Mounjaro™ 5 mg – Tirzepatida (caneta...
              </h3>
              <div className="text-base font-bold text-emerald-600">
                R$ {formatPrice(subtotalProduto)}
              </div>
            </div>

            {/* Quantity Control */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-semibold text-slate-900">{quantidade}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Comprador */}
        <section className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Comprador</h2>
              <p className="text-sm text-slate-600 mt-0.5">{dadosPessoais?.nome || 'Nome não informado'}</p>
              <p className="text-sm text-slate-500">{dadosPessoais?.telefone || ''}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </section>

        {/* Endereço de entrega */}
        <section className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Endereço de entrega</h2>
              {endereco && (
                <>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {endereco.rua}, {endereco.numero}
                  </p>
                  <p className="text-sm text-slate-500">
                    {endereco.bairro} · {endereco.cidade}, {endereco.uf}
                  </p>
                </>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </section>

        {/* Forma de entrega */}
        <section className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Forma de entrega</h2>
              {frete && (
                <>
                  <p className="text-sm text-slate-600 mt-0.5">{frete.nome}</p>
                  <p className="text-sm text-slate-500">{frete.prazo}</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${frete?.valor === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                {frete?.valor === 0 ? 'Grátis' : `R$ ${formatPrice(frete?.valor || 0)}`}
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </section>

        {/* Order Bumps */}
        <section className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
          <h2 className="text-base font-semibold text-emerald-600 mb-3">Adicione ao seu pedido</h2>
          
          <div className="space-y-3">
            {orderBumps.map((bump) => (
              <div
                key={bump.id}
                onClick={() => toggleBump(bump.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  bumpsSelecionados.includes(bump.id)
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Product Image */}
                <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  <img src={bump.imagem} alt={bump.nome} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900">{bump.nome}</span>
                    {bump.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                        {bump.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{bump.descricao}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400 line-through">
                      R$ {formatPrice(bump.precoOriginal)}
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      R$ {formatPrice(bump.precoPromocional)}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-medium">
                      {bump.desconto}
                    </span>
                  </div>
                </div>

                {/* Radio/Check */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  bumpsSelecionados.includes(bump.id)
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-slate-300'
                }`}>
                  {bumpsSelecionados.includes(bump.id) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Forma de pagamento */}
        <section className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Forma de pagamento</h2>
          
          <div
            onClick={() => setMetodoPagamento('pix')}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              metodoPagamento === 'pix'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {/* PIX Logo */}
            <div className="w-14 h-10 shrink-0">
              <img src={pixLogo} alt="PIX" className="w-full h-full object-contain" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900">Pix</div>
              <div className="text-xs text-slate-500">Aprovação imediata</div>
            </div>

            {/* Check */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
              metodoPagamento === 'pix'
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-slate-300'
            }`}>
              {metodoPagamento === 'pix' && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
        </section>

        {/* ANVISA + gov.br Logos */}
        <div className="mx-3 mt-4 mb-2 flex items-center justify-center gap-6 opacity-60">
          <img src={anvisaLogo} alt="ANVISA" className="h-10 w-auto" />
          <img src={govbrLogo} alt="gov.br" className="h-6 w-auto" />
        </div>
      </main>

      {/* Security Badges */}
      <div className="fixed inset-x-0 bottom-[72px] z-40 bg-white border-t">
        <div className="max-w-screen-sm mx-auto px-4 py-2 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1 text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">Compra Segura</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600">
            <Lock className="w-4 h-4" />
            <span className="text-xs">SSL Ativo</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">Garantia</span>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="max-w-screen-sm mx-auto px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between gap-4">
            {/* Total à esquerda */}
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">Total</span>
              <span className="text-xl font-bold text-rose-500">R$ {formatPrice(total)}</span>
            </div>
            
            {/* Botão à direita */}
            <button
              onClick={handlePagar}
              className="px-16 h-12 rounded-full font-semibold text-base bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98] transition"
            >
              Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacaoPage;
