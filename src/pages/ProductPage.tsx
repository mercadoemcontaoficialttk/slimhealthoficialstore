import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Share2, 
  ShoppingCart, 
  MoreHorizontal,
  Zap,
  Star,
  Truck,
  CheckCircle2,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Product images
import foto1 from "@/assets/product/foto1.png";
import foto2 from "@/assets/product/foto2.webp";
import foto3 from "@/assets/product/foto3.webp";
import foto4 from "@/assets/product/foto4.jpg";

// Review images
import carlosSilva from "@/assets/reviews/carlos_silva.jpeg";
import carlosProva from "@/assets/reviews/carlos_prova.jpeg";
import anaSantos from "@/assets/reviews/ana_santos.jpeg";
import anaProva from "@/assets/reviews/ana_prova.jpeg";
import joaoPereira from "@/assets/reviews/joao_pereira.jpeg";
import joaoProva from "@/assets/reviews/joao_prova.jpeg";
import fernandaLima from "@/assets/reviews/fernanda_lima.jpeg";
import fernandaProva from "@/assets/reviews/fernanda_prova.jpeg";
import robertoMendes from "@/assets/reviews/roberto_mendes.jpeg";
import robertoProva from "@/assets/reviews/roberto_prova.jpeg";

// Shop logo
import slimhealthLogo from "@/assets/slimhealth-shop-logo.png";

// Chat icon
import chatIcon from "@/assets/icons/chat.png";

const productImages = [foto1, foto2, foto3, foto4];

const reviews = [
  {
    id: 1,
    name: "Carlos Silva",
    avatar: carlosSilva,
    provaImage: carlosProva,
    text: "Acabei de receber hoje, vou tomar hoje mesmo!! Chegou super rapido e bem embalado. Ansiosa pelos resultados 🙌"
  },
  {
    id: 2,
    name: "Ana Santos",
    avatar: anaSantos,
    provaImage: anaProva,
    text: "Gente funciona demais!! Ja perdi 4kg em 2 semanas. Super recomendo p qm quer emagrecer de vdd"
  },
  {
    id: 3,
    name: "João Pereira",
    avatar: joaoPereira,
    provaImage: joaoProva,
    text: "Melhor compra q fiz!! O preco ta mt bom comparado as farmacias. Ja é a segunda vez q compro aqui"
  },
  {
    id: 4,
    name: "Fernanda Lima",
    avatar: fernandaLima,
    provaImage: fernandaProva,
    text: "Chegou certinho!! Produto original, lacrado. Minha endocrinologista aprovou. Ja to na segunda dose e sem efeitos colaterais"
  },
  {
    id: 5,
    name: "Roberto Mendes",
    avatar: robertoMendes,
    provaImage: robertoProva,
    text: "Recomendo demais! Minha esposa perdeu 6kg no primeiro mes. Agora to comprando pra mim tbm haha"
  }
];

const ProductPage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 9, seconds: 35 });
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

  const handleScroll = () => {
    if (galleryRef.current) {
      const scrollPosition = galleryRef.current.scrollLeft;
      const imageWidth = galleryRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / imageWidth);
      setCurrentImageIndex(newIndex);
    }
  };

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
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
              <span className="absolute -top-1 -right-1 bg-[#fe2c55] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
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
      <div className="relative bg-gray-50">
        <div 
          ref={galleryRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {productImages.map((img, index) => (
            <div 
              key={index} 
              className="min-w-full snap-center flex items-center justify-center p-4"
            >
              <img 
                src={img} 
                alt={`Produto ${index + 1}`}
                className="max-h-[350px] w-auto object-contain"
              />
            </div>
          ))}
        </div>
        
        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
          {currentImageIndex + 1}/{productImages.length}
        </div>
      </div>

      {/* Flash Price Section */}
      <div className="bg-gradient-to-r from-[#fe2c55] to-[#ff6b35] p-4 text-white">
        <div className="flex items-center gap-3">
          <span className="bg-[#ffeb3b] text-[#fe2c55] font-bold text-sm px-2 py-0.5 rounded">
            -96%
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">R$ 67,90</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/80 line-through text-sm">R$ 1.789,87</span>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#ffeb3b] fill-[#ffeb3b]" />
            <span className="font-semibold">Oferta Relâmpago</span>
          </div>
          
          <div className="flex items-center gap-1 text-sm">
            <span>Termina em</span>
            <div className="flex font-mono font-bold">
              <span>{formatTime(timeLeft.hours)}</span>
              <span>:</span>
              <span>{formatTime(timeLeft.minutes)}</span>
              <span>:</span>
              <span>{formatTime(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-[#fff5f7] px-4 py-3 flex items-center gap-2 border-b border-[#ffe0e6]">
        <span className="text-[#fe2c55] text-sm">
          🎟️ Compre R$ 39 e ganhe 10% de desconto
        </span>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start gap-2">
          <span className="bg-[#fe2c55] text-white text-xs px-2 py-1 rounded font-bold shrink-0">
            11.11
          </span>
          <h1 className="text-lg font-semibold text-gray-900 leading-tight">
            Mounjaro™️ 5 mg – Tirzepatida (caneta injetável)
          </h1>
        </div>

        {/* Rating & Sold */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#ffb800] text-[#ffb800]" />
            <span className="font-semibold text-sm">4.9</span>
            <span className="text-gray-500 text-sm">(3)</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">2.977 vendidos</span>
        </div>

        {/* Shipping Info */}
        <div className="flex items-center gap-3 mt-4">
          <Truck className="w-5 h-5 text-gray-600" />
          <div className="flex items-center gap-2">
            <span className="text-[#00b578] font-medium text-sm">Frete grátis</span>
            <span className="text-gray-600 text-sm">Receba de 1 até 15 de fevereiro</span>
          </div>
        </div>
      </div>

      {/* Customer Protection */}
      <div className="mx-4 p-4 bg-[#f8f8f8] rounded-xl mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Proteção do cliente</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00b578]" />
            <span>Devolução gratuita</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00b578]" />
            <span>Reembolso automático por danos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00b578]" />
            <span>Pagamento seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00b578]" />
            <span>Cupom por atraso na coleta</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            Avaliações dos clientes ({reviews.length})
          </h2>
          <button className="text-[#fe2c55] text-sm font-medium">Ver mais</button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">4.9</span>
          <span className="text-gray-500">/ 5</span>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>{review.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{review.name}</p>
                  <p className="text-xs text-[#00b578]">Compra confirmada</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.text}</p>
              <img 
                src={review.provaImage} 
                alt="Prova social" 
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Seller Shop */}
      <div className="mt-6 mx-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={slimhealthLogo} alt="SlimHealth Oficial" />
              <AvatarFallback>SH</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-900">SlimHealth Oficial</span>
              </div>
              <p className="text-xs text-gray-500">98% avaliações positivas • 15.2k seguidores</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-[#fe2c55] text-[#fe2c55] hover:bg-[#fff5f7]">
            Seguir
          </Button>
        </div>
      </div>

      {/* About Product */}
      <div className="mt-6 px-4">
        <h2 className="font-semibold text-gray-900 mb-4">Detalhes do produto</h2>
        
        <p className="text-gray-700 text-sm leading-relaxed">
          Mounjaro™️ é um medicamento injetável de aplicação subcutânea que contém <strong>tirzepatida 5 mg</strong>, indicado para o tratamento de adultos com <strong>diabetes tipo 2</strong>, como adjuvante à dieta e exercícios físicos.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mt-3">
          A tirzepatida atua como um agonista duplo dos receptores <strong>GIP e GLP-1</strong>, hormônios envolvidos na regulação da glicose e do apetite.
        </p>
        
        <button className="text-gray-500 text-sm mt-3 flex items-center gap-1">
          Termos de Uso ▼
        </button>
      </div>

      {/* Spacer for bottom bar */}
      <div className="h-24" />

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 z-50">
        <button className="flex flex-col items-center justify-center text-gray-600 hover:text-[#fe2c55] transition-colors min-w-[50px]">
          <Store className="w-5 h-5" />
          <span className="text-xs mt-0.5">Loja</span>
        </button>
        
        <button className="flex flex-col items-center justify-center text-gray-600 hover:text-[#fe2c55] transition-colors min-w-[50px]">
          <img src={chatIcon} alt="Chat" className="w-5 h-5" />
          <span className="text-xs mt-0.5">Chat</span>
        </button>

        <div className="flex-1 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 border-[#fe2c55] text-[#fe2c55] hover:bg-[#fff5f7] font-semibold text-sm h-11"
          >
            Adicionar ao<br/>carrinho
          </Button>
          <Button 
            onClick={() => navigate("/checkout")}
            className="flex-1 bg-[#fe2c55] hover:bg-[#e6284d] text-white font-semibold text-sm h-11"
          >
            Comprar Agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
