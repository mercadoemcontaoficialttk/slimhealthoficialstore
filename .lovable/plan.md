

## Plano: Criar Página de Pagamento PIX

### Resumo
Vou criar a página `/pix` que exibe o QR Code e a chave PIX copia e cola, com o valor total já calculado automaticamente (produtos + frete + extras). O contador de expiração ficará na parte inferior.

---

### Layout Visual (baseado na referência)

```text
┌─────────────────────────────────────────────────────┐
│ ←  Pagamento PIX        [SlimHealth] + [CIMED]      │
├─────────────────────────────────────────────────────┤
│ ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ (barra)     │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐    │
│  │         VALOR A PAGAR                       │    │
│  │         R$ 129,80                           │    │
│  │         X itens                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │   Escaneie o QR Code com o app do banco     │    │
│  │                                             │    │
│  │         ┌───────────────┐                   │    │
│  │         │   QR CODE     │                   │    │
│  │         │   (imagem)    │                   │    │
│  │         └───────────────┘                   │    │
│  │                                             │    │
│  │         ── ou copie o código ──             │    │
│  │                                             │    │
│  │   ┌─────────────────────────────────┐       │    │
│  │   │   🗐  Copiar código PIX          │       │    │
│  │   └─────────────────────────────────┘       │    │
│  │                                             │    │
│  │   00020101021226940014br.gov.bcb...         │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │   ⏱  O PIX expira em: 14:59                 │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

### Estrutura de Dados

A página irá ler do `localStorage` a key `pedido` que já contém:

```typescript
interface Pedido {
  produto: {
    quantidade: number;
    subtotal: number;
  };
  frete: {
    tipo: string;
    nome: string;
    prazo: string;
    valor: number;
  } | null;
  bumps: Array<{
    id: string;
    nome: string;
    precoPromocional: number;
  }>;
  valorBumps: number;
  total: number;
  metodoPagamento: string;
}
```

---

### Arquivos a Criar/Modificar

| Arquivo | Acao |
|---------|------|
| `src/pages/PixPage.tsx` | Criar nova página |
| `src/App.tsx` | Adicionar rota `/pix` |

---

### Detalhes Tecnicos - PixPage.tsx

#### 1. Imports
```tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Copy, Clock } from "lucide-react";
import { toast } from "sonner";
import slimHealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";
```

#### 2. Estado e Dados
- Carregar pedido do `localStorage`
- Contador regressivo de 15 minutos (900 segundos)
- Calcular quantidade total de itens (produto + bumps)

#### 3. Contador de Expiração
```tsx
const [timeLeft, setTimeLeft] = useState(900); // 15 minutos

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timer);
}, []);

// Formatação MM:SS
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
```

#### 4. Função Copiar Código PIX
```tsx
const handleCopyPix = async () => {
  const pixCode = "00020101021226940014br.gov.bcb.pix..."; // Placeholder
  await navigator.clipboard.writeText(pixCode);
  toast.success("Código PIX copiado!");
};
```

#### 5. QR Code Placeholder
Por enquanto, usaremos uma imagem placeholder do QR Code. Quando a API de gateway for integrada, o QR Code será gerado dinamicamente.

---

### Componentes da Página

#### Header (igual às outras páginas de checkout)
- Seta de voltar
- Título "Pagamento PIX"
- Logos SlimHealth + CIMED
- Barra de progresso completa (100%)

#### Card Valor a Pagar
- Background rose/coral gradient
- "VALOR A PAGAR" em texto pequeno
- Valor total grande (R$ XXX,XX)
- Quantidade de itens (X item/itens)

#### Card QR Code
- Título "Escaneie o QR Code com o app do seu banco"
- Imagem do QR Code (placeholder por agora)
- Divisor "ou copie o código"
- Botão "Copiar código PIX" (rose/coral)
- Código PIX truncado abaixo

#### Card Expiração
- Background amarelo claro
- Ícone de relógio
- Texto "O PIX expira em: MM:SS"

---

### Estilos

- Card valor: `bg-gradient-to-b from-rose-400 to-rose-500`
- Botão copiar: `bg-rose-500 hover:bg-rose-600`
- Card expiração: `bg-amber-50 text-amber-700`
- QR Code container: borda cinza, fundo branco

---

### Calculo Automatico de Itens

```tsx
// Quantidade total = produto principal + bumps selecionados
const totalItens = pedido.produto.quantidade + pedido.bumps.length;
```

---

### Alteração no App.tsx

```tsx
import PixPage from "./pages/PixPage";

// Na lista de rotas:
<Route path="/pix" element={<PixPage />} />
```

---

### Resultado Esperado

1. Lead clica em "Pagar" na confirmação
2. É redirecionado para `/pix`
3. Vê o valor total já calculado (produto + frete + extras)
4. Vê quantidade de itens corretos
5. QR Code e botão de copiar código prontos para uso
6. Contador de 15 minutos começando a contar
7. Logos SlimHealth + CIMED no header

