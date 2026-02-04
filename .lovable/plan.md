

## Plano: Criar Pagina Upsell 2 com Modal de Pagamento One-Click

### Visao Geral
Apos o lead pagar o Upsell 1, sera redirecionado automaticamente para o Upsell 2. Esta pagina oferece a "TENF" (Taxa de Emissao da Nota Fiscal) no valor de R$ 26,75, seguindo o mesmo padrao visual do Upsell 1.

---

### 1. Nova Pagina Upsell2Page.tsx

**Rota:** `/upsell2`

**Conteudo baseado no HTML de referencia:**

```text
+------------------------------------------+
|         [TikTok Shop Logo]               |  <- Sem borda
+------------------------------------------+
|                                          |
|     +--------------------------------+   |
|     | [icone] Status do Pedido       |   |  <- Card branco com sombra
|     |                                |   |
|     | Numero do pedido: 00044792     |   |
|     | Status: Aguardando pagamento   |   |
|     | Valor da TENF: R$ 26,75        |   |
|     +--------------------------------+   |
|                                          |
|     +--------------------------------+   |
|     | [icone] Pagamento Pendente     |   |  <- Card branco com sombra
|     |                                |   |
|     | Seu pedido esta quase pronto   |   |
|     | para ser enviado! Para         |   |
|     | finalizar, realize o pagamento |   |
|     | da TENF no valor de R$ 26,75.  |   |
|     +--------------------------------+   |
|                                          |
|  [   PAGAR TENF - R$ 26,75   ]           |  <- Botao rosa
|                                          |
|     +--------------------------------+   |
|     | [icone] Por que preciso pagar? |   |  <- Card branco com sombra
|     |                                |   |
|     | A TENF e uma taxa obrigatoria  |   |
|     | para emissao da nota fiscal.   |   |
|     | Apos o pagamento, seu pedido   |   |
|     | sera enviado em ate 24 horas.  |   |
|     +--------------------------------+   |
|                                          |
|       [SlimHealth] + [CIMED]             |  <- Logos pequenas
|                                          |
+------------------------------------------+
```

---

### 2. Modal de Pagamento One-Click

**Mesmo estilo do Upsell 1, mas com valor R$ 26,75:**

```text
+------------------------------------------+
|      [TikTok Shop Logo]           [X]    |
+------------------------------------------+
|                                          |
|            TENF                          |
|                                          |
|          R$ 26,75                        |
|                                          |
|     +----------------------------+       |
|     |                            |       |
|     |       [QR Code PIX]        |       |
|     |                            |       |
|     +----------------------------+       |
|                                          |
|  [     Copiar codigo PIX     ]           |
|                                          |
|  [clock] O PIX expira em: 14:40          |
|                                          |
|  [loading] Aguardando confirmacao...     |
|                                          |
+------------------------------------------+
```

---

### 3. Arquivos a Modificar/Criar

| Arquivo | Acao |
|---------|------|
| src/pages/Upsell2Page.tsx | CRIAR - Pagina do Upsell 2 |
| src/App.tsx | EDITAR - Adicionar rota /upsell2 |
| src/pages/Upsell1Page.tsx | EDITAR - Adicionar simulacao de pagamento que redireciona para /upsell2 |

---

### 4. Estrutura do Upsell2Page.tsx

**Imports:**
```tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Copy, Clock, Loader2, CreditCard, Info, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import tiktokLogo from "@/assets/upsell/tiktok-shop.png";
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";
```

**Estados:**
- `showModal` - Controla exibicao do modal
- `timeLeft` - Countdown de 15 minutos

**Funcoes:**
- `handleCopyPix()` - Copia codigo PIX
- `handleOpenModal()` - Abre modal de pagamento
- `formatTime()` - Formata tempo MM:SS

---

### 5. Cards do Upsell 2

**Card 1 - Status do Pedido:**
- Icone: CreditCard (Lucide)
- Titulo: "Status do Pedido"
- Detalhes: Numero, Status, Valor

**Card 2 - Pagamento Pendente:**
- Icone: Info (Lucide)
- Titulo: "Pagamento Pendente"
- Descricao: Texto explicativo sobre a TENF

**Card 3 - Por que preciso pagar?:**
- Icone: HelpCircle (Lucide)
- Titulo: "Por que preciso pagar a TENF?"
- Descricao: Texto explicativo sobre a taxa

---

### 6. Estilizacao (Mesmo Padrao do Upsell 1)

| Elemento | Estilo |
|----------|--------|
| Fundo da pagina | `bg-white` |
| Header | Sem borda |
| Cards | `bg-white rounded-2xl shadow-lg p-6` |
| Icones | Rosa `text-rose-500` em circulo `bg-rose-100` |
| Titulo cards | `font-semibold text-[#1a1a2e]` |
| Texto | `text-gray-600 text-sm` |
| Botao | `bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl shadow-lg font-bold` |
| Logos rodape | SlimHealth + CIMED, `opacity-70` |

---

### 7. Fluxo de Usuario

```text
1. Lead paga Upsell 1 (Taxa NF R$ 47,89)
       |
       v
2. Redireciona automaticamente para /upsell2
       |
       v
3. Lead ve Status do Pedido + informacoes TENF
       |
       v
4. Lead clica em "PAGAR TENF - R$ 26,75"
       |
       v
5. Abre MODAL com QR Code do upsell (one-click)
       |
       v
6. Lead paga ou fecha modal
```

---

### 8. Integracao com Rotas

**App.tsx:**
```tsx
import Upsell2Page from "./pages/Upsell2Page";
// ...
<Route path="/upsell2" element={<Upsell2Page />} />
```

**Upsell1Page.tsx - Simulacao de Pagamento:**
- Adicionar botao "Simular Pagamento Confirmado" no modal
- Ao clicar, redireciona para `/upsell2`

---

### 9. Numero do Pedido

Gerar numero de pedido aleatorio para exibir no card:
```tsx
const orderNumber = Math.floor(Math.random() * 90000) + 10000;
// Exibe: 00044792 (formatado com zeros)
```

---

### Resultado Esperado

1. Pagina Upsell2 com design consistente ao Upsell1
2. 3 cards brancos com sombra: Status, Pagamento Pendente, Por que pagar
3. Icones rosa dentro de circulos rosa claro
4. Modal de pagamento one-click identico ao Upsell1
5. Valor da TENF: R$ 26,75
6. Fluxo automatico: Upsell1 -> Upsell2

