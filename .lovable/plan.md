
## Plano: Criar Pagina Upsell 1 com Modal de Pagamento One-Click

### Visao Geral
Apos o pagamento PIX ser processado, o lead sera redirecionado para uma nova pagina de Upsell 1 (`/upsell1`). Esta pagina oferece a "Taxa de Nota Fiscal" com um modal de pagamento one-click (sem sair da pagina).

---

### 1. Nova Pagina Upsell1Page.tsx

**Rota:** `/upsell1`

**Layout baseado no HTML de referencia:**

```text
+------------------------------------------+
|         [TikTok Shop Logo]               |
+------------------------------------------+
|                                          |
|          Parabens! [emoji]               |
|                                          |
|  Voce acabou de garantir seu produto     |
|  promocional atraves da TikTok Shop!     |
|  Para concluir, basta realizar o         |
|  pagamento da emissao da Nota Fiscal.    |
|                                          |
+------------------------------------------+
|  +------------------------------------+  |
|  |  NF-e (Taxa de Emissao de NF)     |  |
|  |                                    |  |
|  |        R$ 47,89                    |  |
|  |                                    |  |
|  |  Taxa unica para emissao da NF    |  |
|  +------------------------------------+  |
|                                          |
|  [  Efetuar pagamento da Taxa  ]         |
|  (botao rosa/vermelho gradiente)         |
|                                          |
|  +------------------------------------+  |
|  | Para receber seu produto do        |  |
|  | TikTok Shop, e necessario pagar a  |  |
|  | NF-e (Taxa de Emissao de Nota      |  |
|  | Fiscal). Sem o pagamento, o envio  |  |
|  | nao sera autorizado e o pedido     |  |
|  | sera cancelado.                    |  |
|  +------------------------------------+  |
+------------------------------------------+
```

---

### 2. Modal de Pagamento One-Click

**Quando o lead clicar em "Efetuar pagamento da Taxa"**, abre um modal com:

```text
+------------------------------------------+
|      [TikTok Shop Logo]           [X]    |
+------------------------------------------+
|                                          |
|       Taxa de Nota Fiscal                |
|                                          |
|          R$ 47,89                        |
|                                          |
|     +----------------------------+       |
|     |                            |       |
|     |       [QR Code PIX]        |       |
|     |                            |       |
|     +----------------------------+       |
|                                          |
|  [     Copiar codigo PIX     ]           |
|  (botao rosa)                            |
|                                          |
|  [clock] O PIX expira em: 14:40          |
|  (laranja)                               |
|                                          |
|  [loading] Aguardando confirmacao...     |
|  (laranja)                               |
|                                          |
|  00020101021226940014br.gov.bcb.pix...   |
|  (codigo truncado)                       |
+------------------------------------------+
```

---

### 3. Assets Necessarios

| Asset | Destino | Uso |
|-------|---------|-----|
| tiktok.png | src/assets/upsell/tiktok-shop.png | Logo TikTok Shop |

---

### 4. Estrutura de Arquivos

| Arquivo | Acao |
|---------|------|
| src/pages/Upsell1Page.tsx | CRIAR - Pagina principal do upsell |
| src/assets/upsell/tiktok-shop.png | COPIAR - Logo TikTok Shop |
| src/App.tsx | EDITAR - Adicionar rota /upsell1 |
| src/pages/PixPage.tsx | EDITAR - Adicionar simulacao de pagamento que redireciona para /upsell1 |

---

### 5. Detalhes Tecnicos

**Upsell1Page.tsx:**
- Estado `showModal` para controlar exibicao do modal
- Estado `timeLeft` para countdown do PIX (15 minutos)
- Funcao `handleCopyPix()` para copiar codigo
- Design responsivo com max-width 420px centralizado
- Gradiente de fundo `from-gray-50 to-gray-200`
- Card branco com bordas arredondadas (`rounded-2xl`)
- Botao com gradiente rosa/vermelho (`from-rose-500 to-rose-600`)
- Sombra no botao (`shadow-lg`)

**Modal (dentro da mesma pagina):**
- Overlay escuro `bg-black/60`
- Card branco centralizado
- Header com logo TikTok Shop + botao fechar
- QR Code placeholder (mesmo estilo da PixPage)
- Botao "Copiar codigo PIX" rosa
- Contador de expiracao laranja
- Texto "Aguardando confirmacao..." com icone loading
- Codigo PIX truncado

**PixPage.tsx - Simulacao de Pagamento:**
- Adicionar botao "Simular Pagamento Confirmado" (temporario para testes)
- Ao clicar, redireciona para `/upsell1`

---

### 6. Fluxo de Usuario

```text
1. Lead na /pix vendo QR Code
       |
       v
2. Pagamento confirmado (simulado ou real)
       |
       v
3. Redireciona para /upsell1 (Taxa de Nota Fiscal)
       |
       v
4. Lead clica em "Efetuar pagamento da Taxa"
       |
       v
5. Abre MODAL com QR Code do upsell (one-click)
       |
       v
6. Lead paga ou fecha modal
```

---

### 7. Estilizacao do Modal (baseado na imagem de referencia)

- Header: Logo TikTok Shop centralizado + X no canto direito
- Titulo: "Taxa de Nota Fiscal" (cinza)
- Valor: "R$ 47,89" (preto, negrito, grande)
- QR Code: 200x200px com borda arredondada
- Botao: Rosa com icone de copy
- Expiracao: Laranja com icone de relogio
- Status: "Aguardando confirmacao..." laranja com spinner
- Codigo: Truncado, cinza claro

---

### 8. Integracao com Rotas

**App.tsx:**
```tsx
import Upsell1Page from "./pages/Upsell1Page";
// ...
<Route path="/upsell1" element={<Upsell1Page />} />
```

---

### Resultado Esperado

1. Pagina Upsell1 com design pixel-perfect igual ao HTML de referencia
2. Modal de pagamento one-click abrindo na mesma pagina (sem navegacao)
3. Fluxo completo: PIX -> Upsell1 -> Modal -> (proximo passo)
4. Logo TikTok Shop corretamente exibida
5. Cores e espacamentos fieis ao design de referencia
