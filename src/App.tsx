import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initTikTokPixel } from "@/hooks/useTikTokPixel";

// Pages - v2 routing fix
import Index from "./pages/Index";
import MounjaroPage from "./pages/MounjaroPage";
import DadosPessoaisPage from "./pages/DadosPessoaisPage";
import EnderecoPage from "./pages/EnderecoPage";
import ConfirmacaoPage from "./pages/ConfirmacaoPage";
import PixPage from "./pages/PixPage";
import Upsell1Page from "./pages/Upsell1Page";
import Upsell2Page from "./pages/Upsell2Page";
import Upsell3Page from "./pages/Upsell3Page";
import Upsell4Page from "./pages/Upsell4Page";
import RastreioPage from "./pages/RastreioPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Initialize TikTok Pixel on mount
  useEffect(() => {
    initTikTokPixel();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mounjaro" element={<MounjaroPage />} />
          <Route path="/dados-pessoais" element={<DadosPessoaisPage />} />
          <Route path="/endereco" element={<EnderecoPage />} />
          <Route path="/confirmacao" element={<ConfirmacaoPage />} />
          <Route path="/pix" element={<PixPage />} />
          <Route path="/upsell1" element={<Upsell1Page />} />
          <Route path="/upsell2" element={<Upsell2Page />} />
          <Route path="/upsell3" element={<Upsell3Page />} />
          <Route path="/upsell4" element={<Upsell4Page />} />
          <Route path="/rastreio" element={<RastreioPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
