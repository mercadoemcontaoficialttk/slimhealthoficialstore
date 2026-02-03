import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  ShoppingCart, 
  MoreHorizontal,
  Zap,
  Star,
  Truck,
  Shield,
  MessageCircle,
  Store,
  BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import carmedProduct from "@/assets/carmed-product.jpg";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

// Imagens do produto (usando a mesma imagem 3x para demo)
const productImages = [carmedProduct, carmedProduct, carmedProduct];

// Dados mockados das avaliações
const reviews = [
  {
    id: 1,
    name: "Maria S.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    date: "2024-01-15",
    text: "Produto maravilhoso! Chegou super rápido e a qualidade é excelente. Recomendo demais!",
    tags: ["Entrega rápida", "Ótima qualidade"]
  },
  {
    id: 2,
    name: "João P.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    date: "2024-01-10",
    text: "Já é a terceira vez que compro. Sempre satisfeito com o produto e o atendimento.",
    tags: ["Compra repetida", "Satisfeito"]
  },
  {
    id: 3,
    name: "Ana C.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4,
    date: "2024-01-05",
    text: "Muito bom! Hidrata muito bem os lábios. Só achei a embalagem um pouco pequena.",
    tags: ["Hidratante", "Eficaz"]
  }
];

// Produtos recomendados
const recommendedProducts = [
  {
    id: 1,
    name: "Carmed Fini",
    price: 29.90,
    originalPrice: 49.90,
    image: carmedProduct,
    sold: 1234
  },
  {
    id: 2,
    name: "Carmed BFF",
    price: 34.90,
    originalPrice: 59.90,
    image: carmedProduct,
    sold: 856
  },
  {
    id: 3,
    name: "Carmed Gloss",
    price: 24.90,
    originalPrice: 39.90,
    image: carmedProduct,
    sold: 2341
  },
  {
    id: 4,
    name: "Kit Carmed 3x",
    price: 79.90,
    originalPrice: 149.90,
    image: carmedProduct,
    sold: 567
  }
];

const ProductPage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });
  const galleryRef = useRef<HTMLDivElement>(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Scroll gallery
  const scrollToImage = (index: number) => {
    if (galleryRef.current) {
      const scrollAmount = index * galleryRef.current.offsetWidth;
      galleryRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      setCurrentImageIndex(index);
    }
  };

  // Handle gallery scroll
  const handleScroll = () => {
    if (galleryRef.current) {
      const scrollPosition = galleryRef.current.scrollLeft;
      const imageWidth = galleryRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / imageWidth);
      setCurrentImageIndex(newIndex);
    }
  };

  // Calcular data de entrega
  const deliveryDate = format(addDays(new Date(), 5), "d 'de' MMMM", { locale: ptBR });

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[#ff3b66] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                1
              </span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="relative">
        <div 
          ref={galleryRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {productImages.map((img, index) => (
            <div 
              key={index} 
              className="min-w-full snap-center"
            >
              <img 
                src={img} 
                alt={`Produto ${index + 1}`}
                className="w-full aspect-square object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
          {currentImageIndex + 1}/{productImages.length}
        </div>

        {/* Navigation arrows (desktop) */}
        <button 
          onClick={() => scrollToImage(Math.max(0, currentImageIndex - 1))}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-lg hover:bg-white transition-colors"
          disabled={currentImageIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => scrollToImage(Math.min(productImages.length - 1, currentImageIndex + 1))}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-lg hover:bg-white transition-colors"
          disabled={currentImageIndex === productImages.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {productImages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Flash Price Section */}
      <div className="bg-gradient-to-r from-[#ff3b66] via-[#ff5a5f] to-[#ff8a3d] p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#ffeb3b] text-[#ff3b66] font-bold text-sm px-2 py-0.5 rounded">
              -96%
            </span>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">R$ 67,90</span>
                <span className="text-white/70 line-through text-sm">R$ 1.799,00</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#ffeb3b] fill-[#ffeb3b]" />
            <span className="font-semibold">Oferta Relâmpago</span>
          </div>
          
          <div className="flex items-center gap-1 bg-black/20 px-3 py-1.5 rounded-lg">
            <span className="text-sm">Termina em</span>
            <div className="flex gap-1 font-mono font-bold">
              <span className="bg-black/30 px-1.5 py-0.5 rounded">{formatTime(timeLeft.hours)}</span>
              <span>:</span>
              <span className="bg-black/30 px-1.5 py-0.5 rounded">{formatTime(timeLeft.minutes)}</span>
              <span>:</span>
              <span className="bg-black/30 px-1.5 py-0.5 rounded">{formatTime(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-[#fff0f3] px-4 py-2 flex items-center gap-2">
        <span className="bg-[#ff3b66] text-white text-xs px-2 py-0.5 rounded font-semibold">
          SUPER OFERTA
        </span>
        <span className="text-[#ff3b66] text-sm font-medium">
          Compre 2 e ganhe 10% OFF extra
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start gap-2">
          <span className="bg-[#ff3b66] text-white text-xs px-2 py-1 rounded font-bold shrink-0">
            11.11
          </span>
          <h1 className="text-lg font-semibold text-gray-900 leading-tight">
            Carmed Hidratante Labial - Proteção e Hidratação Intensa para seus Lábios
          </h1>
        </div>

        {/* Rating & Sold */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-[#ffb800] text-[#ffb800]" />
            ))}
            <span className="text-sm text-gray-600 ml-1">4.9</span>
          </div>
          <span className="text-sm text-gray-500">2.3k vendidos</span>
        </div>

        {/* Shipping Info */}
        <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-xl">
          <Truck className="w-5 h-5 text-[#00b578]" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#00b578] font-semibold text-sm">Frete Grátis</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 text-sm">Entrega até {deliveryDate}</span>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">Envio para todo o Brasil</p>
          </div>
        </div>
      </div>

      {/* Customer Protection */}
      <div className="mx-4 p-4 bg-[#fef7ed] rounded-xl border border-[#fde68a]">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-[#d97706]" />
          <span className="font-semibold text-gray-900">Proteção ao Cliente</span>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#d97706] rounded-full" />
            Devolução grátis em até 7 dias
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#d97706] rounded-full" />
            Reembolso garantido se não receber
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#d97706] rounded-full" />
            Produto original garantido
          </li>
        </ul>
      </div>

      {/* Reviews Section */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Avaliações</h2>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#ffb800] text-[#ffb800]" />
              <span className="font-semibold">4.9</span>
              <span className="text-gray-500 text-sm">(1.2k)</span>
            </div>
          </div>
          <button className="text-[#ff3b66] text-sm font-medium">Ver todas</button>
        </div>

        {/* Review Tags */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {["Todos", "Entrega rápida", "Ótima qualidade", "Eficaz", "Hidratante"].map((tag) => (
            <span 
              key={tag}
              className="shrink-0 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-4 mt-2">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>{review.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{review.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${star <= review.rating ? 'fill-[#ffb800] text-[#ffb800]' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-gray-700 text-sm leading-relaxed">{review.text}</p>
              <div className="flex gap-2 mt-2">
                {review.tags.map((tag) => (
                  <span key={tag} className="text-xs text-[#ff3b66] bg-[#fff0f3] px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seller Shop */}
      <div className="mt-6 mx-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-[#ff3b66]">
              <AvatarImage src="https://ui-avatars.com/api/?name=Carmed+Oficial&background=ff3b66&color=fff" />
              <AvatarFallback>CO</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-900">Carmed Oficial</span>
                <BadgeCheck className="w-4 h-4 text-[#00b578] fill-[#00b578]" />
              </div>
              <p className="text-xs text-gray-500">98% avaliações positivas</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-[#ff3b66] text-[#ff3b66] hover:bg-[#fff0f3]">
            Visitar
          </Button>
        </div>
      </div>

      {/* About Product */}
      <div className="mt-6 px-4">
        <h2 className="text-lg font-semibold mb-4">Sobre o Produto</h2>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500">Produto</p>
            <p className="font-medium text-gray-900">Hidratante Labial</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500">Marca</p>
            <p className="font-medium text-gray-900">Carmed</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500">Conteúdo</p>
            <p className="font-medium text-gray-900">10g</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500">Validade</p>
            <p className="font-medium text-gray-900">24 meses</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            O Carmed é um hidratante labial que proporciona hidratação intensa e duradoura. 
            Sua fórmula exclusiva contém ingredientes que protegem e nutrem os lábios, 
            deixando-os macios e saudáveis. Ideal para uso diário, especialmente em climas secos 
            ou durante exposição ao sol e vento.
          </p>
          <button className="text-[#ff3b66] text-sm font-medium mt-2">Ler mais</button>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-6 px-4">
        <h2 className="text-lg font-semibold mb-4">Você também pode gostar</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {recommendedProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                <div className="mt-2">
                  <span className="text-[#ff3b66] font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-gray-400 text-xs line-through ml-2">
                    R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{product.sold.toLocaleString()} vendidos</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacer for bottom bar */}
      <div className="h-24" />

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 z-50">
        <button className="flex flex-col items-center justify-center text-gray-600 hover:text-[#ff3b66] transition-colors">
          <Store className="w-5 h-5" />
          <span className="text-xs mt-0.5">Loja</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-gray-600 hover:text-[#ff3b66] transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs mt-0.5">Chat</span>
        </button>

        <div className="flex-1 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 border-[#ff3b66] text-[#ff3b66] hover:bg-[#fff0f3] font-semibold"
          >
            Adicionar
          </Button>
          <Button 
            onClick={() => navigate("/checkout")}
            className="flex-1 bg-gradient-to-r from-[#ff3b66] to-[#ff5a5f] hover:from-[#e6355c] hover:to-[#e65155] text-white font-semibold"
          >
            Comprar Agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
