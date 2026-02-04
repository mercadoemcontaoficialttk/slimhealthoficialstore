
## Plano: Ajustar Página de Dados Pessoais (Conforme Referência)

### Resumo
Vou ajustar a página `/dados-pessoais` para ficar 100% igual às imagens de referência enviadas.

---

### Alterações

#### 1. Barra de Progresso (Header)
**Atual:** Verde + Rosa (metade cada)
**Novo:** Apenas rosa/vermelho, mostrando ~50% de progresso

A barra será uma única cor (rosa/vermelho) e só ficará 100% completa quando o lead chegar na página de pagamento.

```tsx
// De:
<div className="h-1 flex">
  <div className="flex-1 bg-emerald-500" />
  <div className="flex-1 bg-red-500" />
</div>

// Para:
<div className="h-1 bg-slate-200">
  <div className="h-full w-1/2 bg-rose-500" />
</div>
```

---

#### 2. Layout do Footer (Subtotal + Botão)
**Atual:** Subtotal em cima, botão embaixo (largura total)
**Novo:** Subtotal à esquerda (empilhado) e botão à direita (lado a lado)

```tsx
<div className="flex items-center justify-between gap-4">
  {/* Subtotal à esquerda */}
  <div className="flex flex-col">
    <span className="text-sm text-slate-500">Subtotal</span>
    <span className="text-xl font-bold text-rose-500">R$ 67,90</span>
  </div>
  
  {/* Botão à direita */}
  <button className="flex-1 h-12 rounded-full ...">
    Continuar
  </button>
</div>
```

---

#### 3. Adicionar Badges de Segurança
Adicionar seção com ícones verdes antes do footer:
- Compra Segura (ícone ShieldCheck)
- SSL Ativo (ícone Lock)
- Garantia (ícone ShieldCheck)

```tsx
<div className="flex items-center justify-center gap-6 py-4 bg-white border-t">
  <div className="flex items-center gap-1.5 text-emerald-600 text-sm">
    <ShieldCheck className="w-5 h-5" />
    <span>Compra Segura</span>
  </div>
  <div className="flex items-center gap-1.5 text-emerald-600 text-sm">
    <Lock className="w-5 h-5" />
    <span>SSL Ativo</span>
  </div>
  <div className="flex items-center gap-1.5 text-emerald-600 text-sm">
    <ShieldCheck className="w-5 h-5" />
    <span>Garantia</span>
  </div>
</div>
```

---

### Detalhes Técnicos

**Novos imports necessários:**
```tsx
import { ShieldCheck } from "lucide-react";
```

**Estilo do botão desabilitado (conforme referência):**
- Fundo cinza claro (`bg-slate-200`)
- Texto cinza (`text-slate-400`)
- Bordas arredondadas completas (`rounded-full`)

**Cor do subtotal:**
- Trocar de `text-red-500` para `text-rose-500` (mais próximo da referência)

---

### Arquivo Modificado
- `src/pages/DadosPessoaisPage.tsx`

---

### Resultado Esperado
- Barra de progresso apenas rosa (50% preenchida)
- Footer com subtotal à esquerda e botão à direita
- Badges de segurança (Compra Segura, SSL Ativo, Garantia) com ícones verdes
- Design 100% fiel às imagens de referência
