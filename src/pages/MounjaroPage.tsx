import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, MoreHorizontal, Star, Bookmark, Zap, Check, Truck, Store, MessageCircle, Shield } from "lucide-react";

// Assets
import foto1 from "@/assets/mounjaro/foto1.png";
import foto2 from "@/assets/mounjaro/foto2.webp";
import foto3 from "@/assets/mounjaro/foto3.webp";
import foto4 from "@/assets/mounjaro/foto4.jpg";
import seta from "@/assets/mounjaro/seta.png";
import ticketImg from "@/assets/mounjaro/ticket.png";
import slimHealthLogo from "@/assets/mounjaro/slimhealth-logo.png";

const productImages = [foto1, foto2, foto3, foto4];

const reviews = [
  {
    id: 1,
    name: "Carlos Silva",
    avatar: "https://picsum.photos/200/200?random=101",
    stars: 5,
    text: "Chegou hj!! Embalagem perfeita, tudo certinho. Segunda feira começo o tratamento, to super animado!!"
  },
  {
    id: 2,
    name: "Ana Santos",
    avatar: "https://picsum.photos/200/200?random=102",
    stars: 5,
    text: "gente ja perdi 12kg em 2 meses!! to chocada, nunca achei q fosse funcionar assim. recomendo mtooo"
  },
  {
    id: 3,
    name: "João Pereira",
    avatar: "https://picsum.photos/200/200?random=103",
    stars: 4,
    text: "minha esposa ta usando há 3 semanas e já perdeu 5kg. Vou comprar mais uma pra mim tbm"
  },
  {
    id: 4,
    name: "Fernanda Lima",
    avatar: "https://picsum.photos/200/200?random=104",
    stars: 5,
    text: "Recebi ontem, veio rapido demais! Aplicação super facil, nem senti a agulha. Ansiosa pelos resultados"
  },
  {
    id: 5,
    name: "Roberto Mendes",
    avatar: "https://picsum.photos/200/200?random=105",
    stars: 5,
    text: "Cara mudou minha vida!! Antes eu pesava 98kg, hoje to com 82kg. Melhor investimento q fiz"
  },
  {
    id: 6,
    name: "Mariana Costa",
    avatar: "https://picsum.photos/200/200?random=106",
    stars: 4,
    text: "chegou antes do prazo, embalagem refrigerada certinho. Ja apliquei a primeira dose, zero dor!"
  },
  {
    id: 7,
    name: "Paulo Rodrigues",
    avatar: "https://picsum.photos/200/200?random=107",
    stars: 5,
    text: "terceira compra já!! Perdi 15kg desde janeiro, meu medico ficou impressionado com os exames"
  },
  {
    id: 8,
    name: "Lucia Ferreira",
    avatar: "https://picsum.photos/200/200?random=108",
    stars: 5,
    text: "Produto original, lacrado. Entrega super rapida. To no segundo mês e ja emagreci 8kg, feliz demais"
  }
];

const MounjaroPage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [countdown, setCountdown] = useState({ minutes: 9, seconds: 37 });
  const [cartQuantity, setCartQuantity] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        }
        return { minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Gallery scroll handler
  const handleScroll = () => {
    if (galleryRef.current) {
      const scrollPosition = galleryRef.current.scrollLeft;
      const imageWidth = galleryRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / imageWidth);
      setCurrentImageIndex(newIndex);
    }
  };

  const scrollToImage = (index: number) => {
    if (galleryRef.current) {
      const scrollAmount = index * galleryRef.current.offsetWidth;
      galleryRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      setCurrentImageIndex(index);
    }
  };

  const formatTime = (num: number) => num.toString().padStart(2, '0');
  const formatPrice = (price: number) => price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Calculate delivery date
  const getDeliveryDate = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 1);
    const end = new Date(today);
    end.setDate(today.getDate() + 3);
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return `Receba de ${start.getDate()} até ${end.getDate()} de ${months[end.getMonth()]}`;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-screen-sm mx-auto px-3">
          <div className="h-12 flex items-center justify-between">
            <div className="p-2">
              <ChevronLeft className="w-5 h-5" />
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2">
                <img src={seta} alt="Compartilhar" className="w-5 h-5 object-contain" />
              </div>
              <div className="p-2">
                <ShoppingCart className="w-[22px] h-[22px]" />
              </div>
              <div className="p-2">
                <MoreHorizontal className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-sm mx-auto pb-28">
        {/* Gallery */}
        <section className="relative">
          <div 
            ref={galleryRef}
            onScroll={handleScroll}
            className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex w-full h-full">
              {productImages.map((img, index) => (
                <div key={index} className="basis-full shrink-0 snap-center">
                  <div className="aspect-square bg-white">
                    <img 
                      src={img} 
                      alt={`Mounjaro ${index + 1}`} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Counter */}
          <div className="absolute bottom-2 right-2 text-[11px] px-2 py-1 rounded-full bg-black/60 text-white">
            {currentImageIndex + 1}/{productImages.length}
          </div>

          {/* Desktop arrows */}
          <button 
            onClick={() => scrollToImage(Math.max(0, currentImageIndex - 1))}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scrollToImage(Math.min(productImages.length - 1, currentImageIndex + 1))}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </section>

        {/* Flash Price */}
        <section className="bg-gradient-to-r from-[#ff3b66] via-[#ff5a5f] to-[#ff8a3d] text-white p-3 flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/90 text-[#ff3b66] px-1.5 py-[2px] rounded-md">
                -96%
              </span>
              <span className="text-[22px] font-extrabold leading-none">R$ 67,90</span>
            </div>
            <div className="mt-1 text-[12px] text-white/70 line-through">R$ 1.789,87</div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-[13px] font-semibold">
              <Zap className="w-4 h-4 fill-current" />
              <span>Oferta Relâmpago</span>
            </div>
            <div className="text-[15px]">
              Termina em <span className="font-bold">00:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}</span>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="px-3 py-3">
          {/* Promo Banner */}
          <button className="w-full text-[12px] bg-rose-50 text-rose-600 px-3 py-2 rounded-lg">
            <span className="inline-flex items-center justify-between w-full gap-2 font-bold">
              <span className="inline-flex items-center gap-2">
                <img src={ticketImg} alt="Ticket" className="w-4 h-4" />
                <span>Compre R$ 39 e ganhe 10% de desconto</span>
              </span>
              <ChevronRight className="w-5 h-5" />
            </span>
          </button>

          {/* Title */}
          <div className="mt-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-1.5">
              <span className="px-1.5 py-[2px] rounded bg-[#ff4d4f] text-white text-[11px] font-bold leading-none">
                11.11
              </span>
              <h1 className="text-[15px] font-semibold text-slate-900 leading-snug">
                Mounjaro™️ 5mg – Tirzepatida (caneta injetável)
              </h1>
            </div>
            <button className="p-1 rounded hover:bg-slate-100">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-2 text-[13px]">
            <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-[18px] h-[18px] fill-current" />
              4.9
            </span>
            <span className="text-sky-600">(8)</span>
            <span className="text-slate-500">• 39.8k vendido(s)</span>
          </div>

          <div className="my-3 border-b" />

          {/* Shipping */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[13px]">
                <Truck className="w-5 h-5 text-slate-500" />
                <span className="px-2 py-[2px] rounded bg-emerald-50 text-emerald-600 font-semibold">
                  Frete grátis
                </span>
                <span className="text-slate-800">{getDeliveryDate()}</span>
              </div>
              <div className="text-[12px] text-slate-400">
                Taxa de envio: <span className="line-through">R$ 9,60</span>
              </div>
            </div>
            <button className="p-1 rounded hover:bg-slate-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Customer Protection */}
        <section className="bg-[#fdf4e9] text-[#8b5e34]">
          <div className="flex items-center justify-between px-3 py-1.5">
            <div className="inline-flex items-center gap-2 font-semibold text-[13px]">
              <Shield className="w-5 h-5 text-[#8b5e34]" />
              Proteção do cliente
            </div>
            <ChevronRight className="w-5 h-5" />
          </div>
          <div className="px-3 pb-2 text-[13px] text-[#6b4b2a]">
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
              <div className="flex items-start gap-1.5">
                <span className="text-[#a3773f]">✓</span>
                <span>Devolução gratuita</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#a3773f]">✓</span>
                <span>Reembolso automático por danos</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#a3773f]">✓</span>
                <span>Pagamento seguro</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#a3773f]">✓</span>
                <span>Cupom por atraso na coleta</span>
              </div>
            </div>
          </div>
        </section>

        <div className="h-2 bg-slate-100" />

        {/* Reviews */}
        <section className="bg-white px-3 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-slate-900">
              Avaliações dos clientes <span className="text-slate-500 font-normal">(8)</span>
            </h2>
            <button className="flex items-center gap-1 text-slate-600 text-[12px]">
              Ver mais
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Rating Summary */}
          <div className="mt-1 flex items-center gap-2 text-[13px]">
            <span className="font-semibold">4.9</span>
            <span className="text-slate-500">/ 5</span>
            <div className="flex items-center gap-0.5 ml-1">
              {[1,2,3,4].map(i => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
              ))}
              <Star className="w-4 h-4 text-amber-400 fill-current opacity-50" />
            </div>
          </div>

          {/* Reviews List */}
          {reviews.map((review) => (
            <article key={review.id} className="mt-4">
              <div className="flex items-center gap-2">
                <img src={review.avatar} alt={review.name} className="w-6 h-6 rounded-full object-cover" />
                <div className="text-[13px] font-medium">{review.name}</div>
                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600">
                  <Check className="w-3 h-3" />
                  Compra confirmada
                </span>
              </div>
              <div className="mt-1 text-amber-500 text-[12px]">
                {"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}
              </div>
              <p className="mt-2 text-[13px] text-slate-800 line-clamp-3">{review.text}</p>
            </article>
          ))}

          <div className="my-3 h-px bg-slate-200" />

          {/* Store Reviews */}
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-slate-900">
              Avaliações da loja <span className="text-slate-500 font-normal">(1,7 mil)</span>
            </h3>
            <button className="p-1">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-700">
              ✓ Controle glicêmico (3)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-slate-100 text-slate-700">
              <span className="text-amber-500">5★</span> (2)
            </span>
          </div>
        </section>

        <div className="h-2 bg-slate-100" />

        {/* Seller Shop */}
        <section className="bg-white px-3 py-3 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={slimHealthLogo} alt="SlimHealth Logo" className="w-12 h-12 rounded-full object-contain bg-white p-1" />
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[15px]">SlimHealth Oficial</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 48 48">
                    <polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884" />
                    <polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926" />
                  </svg>
                </div>
                <div className="text-xs text-slate-500">498.2K vendido(s)</div>
              </div>
            </div>
            <button 
              className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-900 font-semibold text-[13px] shadow-sm hover:bg-slate-200 active:scale-95 transition"
            >
              Visitar
            </button>
          </div>
        </section>

        <div className="h-2 bg-slate-100" />

        {/* About Product */}
        <section className="bg-white px-3 py-3">
          <h2 className="text-[14px] font-semibold text-slate-900">Sobre este produto</h2>

          <div className="mt-2">
            <div className="text-[12px] font-semibold text-slate-900">Detalhes</div>

            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
              <div className="text-slate-400">Produto</div>
              <div className="text-slate-800">Mounjaro™️ 5mg – Tirzepatida</div>

              <div className="text-slate-400">Princípio Ativo</div>
              <div className="text-slate-800">Tirzepatida 5mg</div>

              <div className="text-slate-400">Indicação</div>
              <div className="text-slate-800">Diabetes tipo 2</div>

              <div className="text-slate-400">Mecanismo de Ação</div>
              <div className="text-slate-800">Agonista duplo GIP/GLP-1</div>

              <div className="text-slate-400">Apresentação</div>
              <div className="text-slate-800">Caneta injetável</div>

              <div className="text-slate-400">Dosagem</div>
              <div className="text-slate-800">5mg</div>

              <div className="text-slate-400">Frequência</div>
              <div className="text-slate-800">Aplicação semanal</div>

              <div className="text-slate-400">Via de Administração</div>
              <div className="text-slate-800">Subcutânea</div>

              <div className="text-slate-400">Prescrição</div>
              <div className="text-slate-800">Medicamento de prescrição médica</div>
            </div>
          </div>

          <div className="my-3 h-px bg-slate-200" />

          <div>
            <div className="text-[12px] font-semibold text-slate-900">Descrição do Produto</div>
            <p className="mt-2 text-[13px] text-slate-800">
              <strong>Mounjaro™️ 5mg – Tirzepatida (caneta injetável)</strong><br /><br />
              Mounjaro™️ é um medicamento injetável de aplicação subcutânea que contém <strong>tirzepatida 5mg</strong>, indicado para o tratamento de adultos com <strong>diabetes tipo 2</strong>, como adjuvante à dieta e exercícios físicos.<br /><br />
              A tirzepatida atua como um agonista duplo dos receptores <strong>GIP e GLP-1</strong>, hormônios envolvidos na regulação da glicose e do apetite, contribuindo para o controle glicêmico e podendo auxiliar na redução de peso como efeito secundário do tratamento.
            </p>

            <div className="mt-3 text-[12px] font-semibold text-slate-900">Características do produto</div>
            <p className="mt-1 text-[13px] text-slate-800">
              • Caneta aplicadora de dose única, pronta para uso<br />
              • Administração subcutânea<br />
              • Dosagem: 5mg (conforme prescrição médica)<br />
              • Uso semanal<br /><br />
              O dispositivo foi desenvolvido para facilitar a aplicação, oferecendo praticidade e precisão na administração da dose.
            </p>

            <div className="mt-3 text-[12px] font-semibold text-slate-900">Aviso importante</div>
            <p className="mt-1 text-[13px] text-slate-800">
              <strong>Tratamento de medicamento de prescrição médica. O uso deve ser feito somente sob orientação de um profissional de saúde.</strong>
            </p>
          </div>
        </section>

      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="max-w-screen-sm mx-auto px-3 pt-2 pb-[calc(14px+env(safe-area-inset-bottom))] flex items-end gap-2">
          {/* Store */}
          <button className="flex flex-col items-center justify-center w-12 shrink-0 text-[11px] text-slate-700">
            <div className="relative">
              <Store className="w-6 h-6 text-slate-500" />
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-[#ff3b66] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
            </div>
            <span className="mt-0.5 leading-none">Loja</span>
          </button>

          {/* Chat */}
          <button className="flex flex-col items-center justify-center w-12 shrink-0 text-[11px] text-slate-700">
            <MessageCircle className="w-6 h-6 text-slate-500" />
            <span className="mt-0.5 leading-none">Chat</span>
          </button>

          {/* Add to Cart */}
          <button 
            onClick={() => setCartQuantity(prev => prev + 1)}
            className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-900 font-semibold text-[14px] leading-tight px-3"
          >
            Adicionar ao<br />carrinho
          </button>

          {/* Buy Now */}
          <button 
            onClick={() => {
              const quantidade = cartQuantity > 0 ? cartQuantity : 1;
              localStorage.setItem('dadosPessoais', JSON.stringify({ quantidade }));
              navigate("/dados-pessoais");
            }}
            className="flex-1 h-11 rounded-xl bg-[#ff3b66] text-white font-semibold text-[13px] leading-none"
          >
            Comprar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default MounjaroPage;
