import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, ChevronLeft, Grid2X2, SlidersHorizontal } from "lucide-react";

// Assets
import logo from "@/assets/shop/logo.png";
import seta from "@/assets/shop/seta.png";
import ticket from "@/assets/shop/ticket.png";
import ticketVideo from "@/assets/shop/ticket2.mp4";

// Products
import prod1 from "@/assets/shop/prod1.png";
import prod2 from "@/assets/shop/prod2.png";
import prod3 from "@/assets/shop/prod3.png";
import prod4 from "@/assets/shop/prod4.png";
import prod5 from "@/assets/shop/prod5.png";
import prod6 from "@/assets/shop/prod6.png";
import prod7 from "@/assets/shop/prod7.png";
import prod8 from "@/assets/shop/prod8.png";
import prod9 from "@/assets/shop/prod9.png";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
  discountType: string;
  rating: number;
  sold: number;
  link: string;
}

const products: Product[] = [
  {
    id: "mounjaro",
    name: "Mounjaro™️ 2,5 mg – Tirzepatida (caneta injetável)",
    image: prod1,
    price: 67.90,
    originalPrice: 1789.87,
    discount: "96% OFF",
    discountType: "11.11",
    rating: 4.8,
    sold: 2540,
    link: "/checkout"
  },
  {
    id: "smarttv43",
    name: "Smart TV Samsung 43\" Crystal UHD 4K UN43U8600 2025",
    image: prod2,
    price: 2408.61,
    originalPrice: 2589.90,
    discount: "PIX",
    discountType: "7% OFF",
    rating: 4.9,
    sold: 2224,
    link: "/checkout"
  },
  {
    id: "pcgamer",
    name: "PC Gamer Pichau Afrodite i5-12400F RTX 4060 16GB SSD 1TB",
    image: prod3,
    price: 3899.90,
    originalPrice: 4599.90,
    discount: "PROMO",
    discountType: "15% OFF",
    rating: 4.9,
    sold: 856,
    link: "/checkout"
  },
  {
    id: "caixadesom4",
    name: "Caixa de Som Boombox Plus AIWA BBS-01-LBL 200W BT 30H IP66 USB RGB",
    image: prod4,
    price: 87.30,
    originalPrice: 2379.90,
    discount: "96% OFF",
    discountType: "11.11",
    rating: 4.6,
    sold: 4549,
    link: "/checkout"
  },
  {
    id: "ps5pro",
    name: "Console PlayStation 5 Pro Sony SSD 2TB DualSense Branco",
    image: prod5,
    price: 4299.90,
    originalPrice: 4799.90,
    discount: "LANÇAMENTO",
    discountType: "10% OFF",
    rating: 4.9,
    sold: 3247,
    link: "/checkout"
  },
  {
    id: "steamdeck",
    name: "Valve Steam Deck Console portátil 64GB SSD Midnight Black",
    image: prod6,
    price: 2699.90,
    originalPrice: 3599.90,
    discount: "25% OFF",
    discountType: "11.11",
    rating: 4.7,
    sold: 2156,
    link: "/checkout"
  },
  {
    id: "psportal",
    name: "Reprodutor remoto PlayStation Portal Midnight Black",
    image: prod7,
    price: 1899.90,
    originalPrice: 2239.90,
    discount: "15% OFF",
    discountType: "11.11",
    rating: 4.6,
    sold: 1894,
    link: "/checkout"
  },
  {
    id: "xboxalldigital",
    name: "Microsoft Xbox All Digital Console + Controle Branco",
    image: prod8,
    price: 1899.90,
    originalPrice: 2239.90,
    discount: "15% OFF",
    discountType: "11.11",
    rating: 4.8,
    sold: 1654,
    link: "/checkout"
  },
  {
    id: "alienware",
    name: "Alienware Aurora R16 Gaming Desktop Intel i9-14900KF RTX 4080",
    image: prod9,
    price: 15999.90,
    originalPrice: 18999.90,
    discount: "85% OFF",
    discountType: "11.11",
    rating: 4.6,
    sold: 781,
    link: "/checkout"
  }
];

const ProductPage = () => {
  const navigate = useNavigate();
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponClaimed, setCouponClaimed] = useState(false);
  const [cartCount] = useState(0);

  useEffect(() => {
    const couponShown = localStorage.getItem('couponShown');
    if (couponShown !== 'true') {
      setShowCouponModal(true);
    }
  }, []);

  const handleClaimCoupon = () => {
    setCouponClaimed(true);
    localStorage.setItem('couponShown', 'true');
    setTimeout(() => {
      setShowCouponModal(false);
    }, 600);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div className="flex items-center gap-2 font-extrabold text-gray-900 text-base">
                <span className="text-lg">👋</span>
                <span>Olá, Cupom Exclusivo!</span>
              </div>
            </div>

            {/* Body */}
            <div className="px-4 pb-4">
              <span className="inline-block px-3 py-1.5 font-extrabold text-xs rounded-full text-white bg-[#ff4d4f]">
                ATÉ 85% OFF
              </span>
              <div className="mt-2.5 text-gray-500 text-sm">
                Toda a loja com <strong className="text-gray-900">até 85% OFF</strong>.
              </div>
              <div className="text-gray-400 text-xs mb-3">
                Aplicado automaticamente no checkout.
              </div>

              {/* Video */}
              <div className="flex justify-center items-center my-3">
                <div className="w-[140px] h-[140px] rounded-full overflow-hidden">
                  <video 
                    src={ticketVideo} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <button
                onClick={handleClaimCoupon}
                disabled={couponClaimed}
                className={`w-full h-11 rounded-xl border-0 text-white font-bold text-[15px] cursor-pointer shadow-lg transition-transform active:translate-y-[1px] ${
                  couponClaimed 
                    ? 'bg-green-600 shadow-green-600/25' 
                    : 'bg-[#ff3b66] shadow-[#ff3b66]/35'
                }`}
              >
                {couponClaimed ? 'Resgatado' : 'Resgatar Cupom'}
              </button>

              <div className="flex items-center gap-2 text-gray-400 text-[11px] mt-2.5 leading-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Cupom por tempo limitado.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-3 py-2">
          <div className="flex items-center gap-3">
            {/* Back */}
            <button 
              onClick={() => navigate(-1)}
              className="shrink-0 p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="flex-1">
              <label className="relative block">
                <span className="absolute inset-y-0 left-2 flex items-center">
                  <Search className="w-4 h-4 text-slate-400" />
                </span>
                <input 
                  type="text" 
                  placeholder="Pesquisar" 
                  className="w-full rounded-2xl bg-slate-100 placeholder-slate-400 text-[15px] pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            {/* Share */}
            <button className="shrink-0 p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition">
              <img src={seta} alt="Compartilhar" className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button className="shrink-0 p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ff2d55] text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-md border-2 border-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {/* Seller Section */}
        <section className="pt-3 pb-3 border-b">
          <div className="max-w-6xl mx-auto px-3 space-y-3">
            {/* Separator */}
            <div className="h-2 bg-slate-100 -mx-3" />

            {/* Seller Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Atakarejo Oficial" className="w-14 h-14 rounded-full object-cover" />
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[16px]">Atakarejo Oficial</span>
                    {/* Verified Badge */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 48 48">
                      <polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884" />
                      <polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926" />
                    </svg>
                  </div>
                  <div className="text-xs text-slate-500">18.8K vendido(s)</div>
                </div>
              </div>

              <button className="px-3 py-1.5 rounded-full border text-sm text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition shadow-sm">
                Mensagem
              </button>
            </div>

            {/* Coupon Card */}
            <div className="rounded-xl bg-[#EAF7F7] border border-[#DDF0F0] px-3 py-3 flex items-start justify-between">
              <div className="text-[13px] leading-tight">
                <div className="font-semibold text-slate-700">Semana #JANEIRO</div>
                <div className="text-slate-500 text-[12px]">Cupom de até 85% OFF</div>
              </div>
              <div className="text-[12px] font-medium text-sky-500 self-center">Resgatado</div>
            </div>
          </div>
        </section>

        {/* Separator */}
        <div className="h-2 bg-slate-100" />

        {/* Products Section */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-3 py-2">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b">
              <nav className="flex items-center gap-6 text-[13px] text-slate-500">
                <button className="py-3">Página inicial</button>
                <button className="py-3 relative text-slate-900 font-medium">
                  Produtos
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-slate-900 rounded-full" />
                </button>
                <button className="py-3">Categorias</button>
              </nav>
            </div>

            {/* Subtabs */}
            <div className="flex items-center justify-between text-[13px] text-slate-600 mt-2">
              <div className="flex items-center gap-4">
                <button className="py-2 text-slate-900 font-medium">Recomendado</button>
                <button className="py-2">Mais vendidos</button>
                <button className="py-2">Lançamentos</button>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-1.5 rounded hover:bg-slate-100">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
                <button className="p-1.5 rounded hover:bg-slate-100">
                  <Grid2X2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Separator */}
            <div className="h-2 bg-slate-100 mt-1 mb-2 -mx-3" />

            {/* Product List */}
            <div className="divide-y">
              {products.map((product) => (
                <article key={product.id} className="py-3 flex gap-3 items-start">
                  <a 
                    href={product.link}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(product.link);
                    }}
                    className="flex gap-3 items-start flex-1"
                  >
                    <div className="w-20 h-20 rounded overflow-hidden bg-slate-100 shrink-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-medium text-slate-900 leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1 text-[10px] leading-none flex-wrap">
                        <span className="px-1.5 py-[2px] rounded bg-[#ff4d4f] text-white font-bold">
                          {product.discountType}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-[2px] rounded bg-[#fff0f1] text-[#ff4d4f] font-semibold">
                          <img src={ticket} alt="ticket" className="w-3.5 h-3.5" />
                          {product.discount}
                        </span>
                        <span className="px-1.5 py-[2px] rounded bg-emerald-50 text-emerald-600 font-medium">
                          Frete grátis
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        <span className="text-amber-500">★ {product.rating}</span> • {product.sold.toLocaleString()} vendido(s)
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <div className="text-[18px] font-bold text-[#ff335f]">
                          R$ {formatPrice(product.price)}
                        </div>
                        <div className="text-[11px] text-slate-400 line-through">
                          R$ {formatPrice(product.originalPrice)}
                        </div>
                      </div>
                    </div>
                  </a>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <button className="p-2 rounded-full bg-[#ffe7ee]">
                      <ShoppingCart className="w-4 h-4 text-[#ff3b66]" />
                    </button>
                    <button 
                      onClick={() => navigate(product.link)}
                      className="px-3 py-1.5 rounded-full bg-[#ff3b66] text-white text-[12px] font-semibold shadow-sm"
                    >
                      Comprar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductPage;
