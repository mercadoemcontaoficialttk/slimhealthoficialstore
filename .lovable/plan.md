

## Plano: Criar Pagina Upsell 3 - Correcao de Frete

### Visao Geral
O Upsell 3 simula uma verificacao do pedido e depois revela um "erro de frete" que precisa ser pago. Possui animacoes sequenciais e um fluxo em duas fases.

---

### 1. Fluxo de Usuario

```text
Fase 1 - Verificacao (3.5 segundos):
+------------------------------------------+
|         [TikTok Shop Logo]               |
+------------------------------------------+
|                                          |
|              [✓]                         |  <- Icone rosa animado
|                                          |
|    Seu pedido foi concluido!             |
|                                          |
|    Aguarde enquanto realizamos           |
|    a verificacao do pedido...            |
|                                          |
|    [====== Barra Progresso ======]       |
|           Processando...                 |
|                                          |
+------------------------------------------+

Fase 2 - Cards Sequenciais (apos 3.5s):
+------------------------------------------+
|                                          |
|  +------------------------------------+  |
|  | [✓] Pedido Concluido com Sucesso  |  |  <- Card verde (aparece 1o)
|  |     Aguarde um momento...          |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | [⚠] Validacao do CEP para Entrega |  |  <- Card amarelo (2s depois)
|  |     Estamos verificando...         |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | [✕] O valor do Frete foi          |  |  <- Card vermelho (4s depois)
|  |     calculado errado               |  |
|  |                                    |  |
|  |     [PAGAR FRETE - R$ XX,XX]       |  |
|  |                                    |  |
|  |  O valor pago do frete anterior   |  |
|  |  sera reembolsado                  |  |
|  +------------------------------------+  |
|                                          |
|       [SlimHealth] + [CIMED]             |
|                                          |
+------------------------------------------+
```

---

### 2. Estrutura dos Cards

**Card 1 - Sucesso (verde):**
- Icone: Check verde em circulo com gradiente verde
- Titulo: "Pedido Concluido com Sucesso"
- Texto: "Aguarde um momento..."

**Card 2 - Aviso (amarelo):**
- Icone: Alerta amarelo em circulo com gradiente amarelo
- Titulo: "Validacao do CEP para Entrega"
- Texto: "Estamos verificando as informacoes..."

**Card 3 - Erro (vermelho) - Destaque:**
- Icone: X vermelho em circulo com gradiente rosa/vermelho
- Titulo: "O valor do Frete foi calculado errado para sua regiao"
- Texto: "O pedido nao sera enviado. Faca a correcao..."
- Botao: "PAGAR FRETE - R$ XX,XX"
- Aviso: "O valor pago do frete anterior sera reembolsado"

---

### 3. Animacoes

| Fase | Tempo | Acao |
|------|-------|------|
| 1 | 0s | Inicia barra de progresso |
| 1 | 1s | Texto: "Verificando dados..." |
| 1 | 2s | Texto: "Quase pronto..." |
| 1 | 2.8s | Texto: "Concluido!" |
| 2 | 3.5s | Esconde verificacao, mostra cards |
| 2 | 3.6s | Card 1 aparece com slide-up |
| 2 | 5.5s | Card 2 aparece com slide-up |
| 2 | 7.5s | Card 3 aparece com slide-up + scroll |

---

### 4. Arquivos a Modificar/Criar

| Arquivo | Acao |
|---------|------|
| src/pages/Upsell3Page.tsx | CRIAR - Nova pagina com animacoes |
| src/App.tsx | EDITAR - Adicionar rota /upsell3 |
| src/pages/Upsell2Page.tsx | EDITAR - Adicionar botao simular pagamento -> /upsell3 |

---

### 5. Estados do Componente

```tsx
// Fase atual: 'verification' ou 'cards'
const [phase, setPhase] = useState<'verification' | 'cards'>('verification');

// Progresso da barra (0-100)
const [progress, setProgress] = useState(0);

// Texto do status
const [statusText, setStatusText] = useState('Processando...');

// Controle de visibilidade dos cards
const [visibleCards, setVisibleCards] = useState({
  card1: false,
  card2: false,
  card3: false,
});

// Modal de pagamento
const [showModal, setShowModal] = useState(false);
const [timeLeft, setTimeLeft] = useState(900);
```

---

### 6. Icones 3D para os Cards

**Card 1 - Sucesso (verde):**
```tsx
<div className="w-14 h-14 rounded-full flex items-center justify-center
  bg-gradient-to-br from-emerald-400 to-emerald-600
  shadow-[0_4px_12px_rgba(16,185,129,0.4)]">
  <Check className="w-7 h-7 text-white" />
</div>
```

**Card 2 - Aviso (amarelo):**
```tsx
<div className="w-14 h-14 rounded-full flex items-center justify-center
  bg-gradient-to-br from-amber-400 to-amber-500
  shadow-[0_4px_12px_rgba(245,158,11,0.4)]">
  <AlertTriangle className="w-7 h-7 text-white" />
</div>
```

**Card 3 - Erro (vermelho):**
```tsx
<div className="w-14 h-14 rounded-full flex items-center justify-center
  bg-gradient-to-br from-rose-500 to-rose-600
  shadow-[0_4px_12px_rgba(244,63,94,0.4)]">
  <X className="w-7 h-7 text-white" />
</div>
```

---

### 7. Modal de Pagamento

Mesmo formato dos outros upsells:
- Header com logo TikTok
- Titulo: "Correcao de Frete"
- Valor: R$ XX,XX (definir valor)
- QR Code simulado
- Botao copiar PIX
- Timer 15 minutos
- Aguardando confirmacao
- Botao simular pagamento (para testes)

---

### 8. Estilizacao Consistente

| Elemento | Estilo |
|----------|--------|
| Fundo pagina | `bg-white` |
| Header | Sem borda, logo TikTok centralizado |
| Cards | `bg-white rounded-2xl shadow-lg p-6` centralizados |
| Card destaque | Borda rosa `border-2 border-rose-500` |
| Botao principal | `bg-gradient-to-r from-rose-500 to-rose-600` |
| Logos rodape | SlimHealth + CIMED, `opacity-70` |
| Aviso reembolso | `bg-rose-50 text-rose-600` |

---

### 9. Animacao CSS

Adicionar ao index.css:
```css
@keyframes card-slide-up {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-card-slide-up {
  animation: card-slide-up 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
```

---

### 10. Valor do Frete

Baseado no padrao do HTML de referencia, o valor sugerido para o frete e **R$ 35,90** (um valor razoavel para "correcao de frete").

---

### Resultado Esperado

1. Pagina inicia com verificacao animada (barra de progresso)
2. Apos 3.5 segundos, cards aparecem sequencialmente
3. Card final com erro de frete e botao de pagamento
4. Modal one-click identico aos outros upsells
5. Botao de simular pagamento para testes
6. Visual 100% consistente com Upsell 1 e Upsell 2

