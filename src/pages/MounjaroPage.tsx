import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, MoreHorizontal, Star, Bookmark, Zap } from "lucide-react";

// Assets
import foto1 from "@/assets/mounjaro/foto1.png";
import foto2 from "@/assets/mounjaro/foto2.webp";
import foto3 from "@/assets/mounjaro/foto3.webp";
import seta from "@/assets/mounjaro/seta.png";
import ticketImg from "@/assets/mounjaro/ticket.png";
import logo from "@/assets/mounjaro/logo.png";

// Product images for recommended
import prod1 from "@/assets/shop/prod1.png";
import prod2 from "@/assets/shop/prod2.png";
import prod3 from "@/assets/shop/prod3.png";
import prod4 from "@/assets/shop/prod4.png";

const productImages = [foto1, foto2, foto3];

const reviews = [
  {
    id: 1,
    name: "Carlos Silva",
    avatar: "https://picsum.photos/200/200?random=101",
    stars: 5,
    text: "Excelente medicamento!! O mounjaro ajudou mt no controle da minha diabetes tipo 2. A aplicação semanal é prática e os resultados nos exames de sangue foram surpreendentes ,Recomendo p quem precisa controlar a glicose."
  },
  {
    id: 2,
    name: "Ana Santos",
    avatar: "https://picsum.photos/200/200?random=102",
    stars: 5,
    text: "Finalmente encontrei um tratamento q funciona!! O mounjaro não só controla a diabetes como tambem ajudou na perda de peso. A caneta é facil de usar e a dosagem semanal facilita mt o tratamento diario."
  },
  {
    id: 3,
    name: "João Pereira",
    avatar: "https://picsum.photos/200/200?random=103",
    stars: 4,
    text: "Medicamento revolucionario!! Alem de controlar perfeitamente a glicemia, o mounjaro ajudou a reduzir meu peso corporal. Os efeitos colaterais foram minimos e o resultado valeu cada centavo investido na saude."
  }
];

const recommendedProducts = [
  { id: 1, name: "Mounjaro™️ 2,5 mg – Tirzepatida (caneta injetável)", image: prod1, price: 67.90, oldPrice: 1789.87, sold: 2540 },
  { id: 2, name: "Caixa de Som PartyBox AIWA PB-04 Bluetooth 18H RGB USB TWS Preto", image: prod2, price: 105.90, oldPrice: 2099.99, sold: 412 },
  { id: 3, name: "Torre de Som AIWA T2W-02 2300W 2Woofers10\" Bluetooth RGB USB FM DJ", image: prod3, price: 89.90, oldPrice: 2649.90, sold: 1540 },
  { id: 4, name: "Caixa de Som Boombox Plus AIWA BBS-01-LBL 200W BT 30H IP66 USB RGB", image: prod4, price: 87.30, oldPrice: 2379.90, sold: 4549 }
];

const MounjaroPage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [countdown, setCountdown] = useState({ minutes: 9, seconds: 37 });
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
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition">
                <img src={seta} alt="Compartilhar" className="w-5 h-5 object-contain" />
              </button>
              <button 
                onClick={() => navigate("/product")}
                className="p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition"
              >
                <ShoppingCart className="w-[22px] h-[22px]" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition">
                <MoreHorizontal className="w-6 h-6" />
              </button>
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
                Mounjaro™️ 2,5 mg – Tirzepatida (caneta injetável)
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
            <span className="text-sky-600">(3)</span>
            <span className="text-slate-500">• 2.977 vendidos</span>
          </div>

          <div className="my-3 border-b" />

          {/* Shipping */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[13px]">
                <span className="text-lg">🚚</span>
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
              <span className="text-lg">🛡️</span>
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
              Avaliações dos clientes <span className="text-slate-500 font-normal">(3)</span>
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
              </div>
              <div className="mt-1 text-amber-500 text-[12px]">
                {"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}
              </div>
              <div className="text-[11px] text-slate-500">Compra Verificada</div>
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
              <img src={logo} alt="Logo da loja" className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 bg-white" />
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[15px]">Atakarejo Oficial</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 48 48">
                    <polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884" />
                    <polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926" />
                  </svg>
                </div>
                <div className="text-xs text-slate-500">18.8K vendido(s)</div>
              </div>
            </div>
            <button 
              onClick={() => navigate("/product")}
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
              <div className="text-slate-800">Mounjaro™️ 2,5 mg – Tirzepatida</div>

              <div className="text-slate-400">Princípio Ativo</div>
              <div className="text-slate-800">Tirzepatida 2,5 mg</div>

              <div className="text-slate-400">Indicação</div>
              <div className="text-slate-800">Diabetes tipo 2</div>

              <div className="text-slate-400">Mecanismo de Ação</div>
              <div className="text-slate-800">Agonista duplo GIP/GLP-1</div>

              <div className="text-slate-400">Apresentação</div>
              <div className="text-slate-800">Caneta injetável</div>

              <div className="text-slate-400">Dosagem</div>
              <div className="text-slate-800">2,5 mg (dose inicial comum)</div>

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
              <strong>Mounjaro™️ 2,5 mg – Tirzepatida (caneta injetável)</strong><br /><br />
              Mounjaro™️ é um medicamento injetável de aplicação subcutânea que contém <strong>tirzepatida 2,5 mg</strong>, indicado para o tratamento de adultos com <strong>diabetes tipo 2</strong>, como adjuvante à dieta e exercícios físicos.<br /><br />
              A tirzepatida atua como um agonista duplo dos receptores <strong>GIP e GLP-1</strong>, hormônios envolvidos na regulação da glicose e do apetite, contribuindo para o controle glicêmico e podendo auxiliar na redução de peso como efeito secundário do tratamento.
            </p>

            <div className="mt-3 text-[12px] font-semibold text-slate-900">Características do produto</div>
            <p className="mt-1 text-[13px] text-slate-800">
              • Caneta aplicadora de dose única, pronta para uso<br />
              • Administração subcutânea<br />
              • Dosagem inicial comum: 2,5 mg (conforme prescrição médica)<br />
              • Uso semanal<br /><br />
              O dispositivo foi desenvolvido para facilitar a aplicação, oferecendo praticidade e precisão na administração da dose.
            </p>

            <div className="mt-3 text-[12px] font-semibold text-slate-900">Aviso importante</div>
            <p className="mt-1 text-[13px] text-slate-800">
              <strong>Tratamento de medicamento de prescrição médica. O uso deve ser feito somente sob orientação de um profissional de saúde.</strong>
            </p>
          </div>
        </section>

        {/* Recommended Products */}
        <section className="bg-[#f5f5f5] px-3 pt-3 pb-4">
          <h2 className="text-[18px] font-semibold text-slate-900 mb-4">Você também pode gostar</h2>
          
          <div className="grid grid-cols-2 gap-3">
            {recommendedProducts.map((product) => (
              <a 
                key={product.id}
                href="#"
                onClick={(e) => { e.preventDefault(); }}
                className="block rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="aspect-[4/3] bg-white">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                </div>
                <div className="p-2.5">
                  <div className="mb-1">
                    <p className="text-[13px] text-slate-900 leading-snug line-clamp-2 min-h-[34px]">{product.name}</p>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-baseline gap-2">
                      <div className="text-rose-600 font-bold text-[16px]">R$ {formatPrice(product.price)}</div>
                      <span className="inline-flex h-5 px-1.5 rounded bg-[#ff4d4f] text-white text-[11px] font-bold leading-none items-center">11.11</span>
                    </div>
                    <div className="text-[12px] text-slate-400 line-through">R$ {formatPrice(product.oldPrice)}</div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px]">
                    <span className="inline-flex items-center px-1.5 py-[2px] rounded bg-rose-50 text-rose-600 font-bold">85% OFF</span>
                    <span className="inline-flex items-center px-1.5 py-[2px] rounded bg-emerald-50 text-emerald-600 font-bold">Frete grátis</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-slate-500">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span>4.6</span>
                    <span>• {product.sold.toLocaleString('pt-BR')} vendidos</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="max-w-screen-sm mx-auto px-3 pt-2 pb-[calc(14px+env(safe-area-inset-bottom))] flex items-end gap-2">
          {/* Store */}
          <button 
            onClick={() => navigate("/product")}
            className="flex flex-col items-center justify-center w-12 shrink-0 text-[11px] text-slate-700"
          >
            <span className="text-xl">🏪</span>
            <span className="mt-0.5 leading-none">Loja</span>
          </button>

          {/* Chat */}
          <button className="flex flex-col items-center justify-center w-12 shrink-0 text-[11px] text-slate-700">
            <span className="text-xl">💬</span>
            <span className="mt-0.5 leading-none">Chat</span>
          </button>

          {/* Add to Cart */}
          <button className="flex-1 h-11 rounded-xl bg-slate-100 text-slate-900 font-semibold text-[14px] leading-tight px-3">
            Adicionar ao<br />carrinho
          </button>

          {/* Buy Now */}
          <button 
            onClick={() => navigate("/checkout")}
            className="flex-1 h-11 rounded-xl bg-[#ff3b66] text-white font-semibold text-[14px] leading-none"
          >
            Comprar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default MounjaroPage;
