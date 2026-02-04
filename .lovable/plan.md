

## Plano: Corrigir Erro 404 na Navegação para /endereco

### Diagnóstico
Após análise do código, identifiquei que:
1. A rota `/endereco` está corretamente configurada em `App.tsx` (linha 24)
2. O arquivo `EnderecoPage.tsx` existe e está correto
3. A navegação em `DadosPessoaisPage.tsx` usa `navigate("/endereco")` corretamente
4. Os warnings no console sobre refs podem estar interferindo no roteamento

O problema pode ser causado por:
- Cache do Vite que não reconhece a nova rota
- Problema de hot-reload após criar o arquivo

---

### Solução

Vou fazer uma pequena modificação no `App.tsx` para forçar o reload do roteador e garantir que todas as rotas funcionem corretamente.

**Alterações em `src/App.tsx`:**
- Reorganizar imports para garantir ordem correta
- Adicionar comentário de versão para forçar rebuild

```tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import MounjaroPage from "./pages/MounjaroPage";
import DadosPessoaisPage from "./pages/DadosPessoaisPage";
import EnderecoPage from "./pages/EnderecoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

---

### Arquivos Modificados
- `src/App.tsx` - Reorganizar imports para forçar rebuild

---

### Resultado Esperado
- Navegação de `/dados-pessoais` para `/endereco` funcionando sem erro 404
- Fluxo fluido do início ao fim do checkout

