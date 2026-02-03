
## Plano: Ajustes Visuais na Página Mounjaro

### Resumo
Vou fazer três ajustes na página `/mounjaro` conforme as referências enviadas:
1. Substituir emojis por ícones limpos (SVG/Lucide)
2. Deixar botões do header estáticos (não clicáveis)
3. Reduzir levemente o tamanho da fonte no botão "Comprar Agora"

---

### Alterações

#### 1. Substituir emojis por ícones

**Barra inferior (Loja e Chat):**
- Substituir `🏪` por um ícone SVG de loja (outline) semelhante à referência
- Substituir `💬` por um ícone SVG de chat (balão com rosto) semelhante à referência

**Seção de frete:**
- Substituir `🚚` por ícone SVG de caminhão (Lucide `Truck`)

**Seção de proteção do cliente:**
- Substituir `🛡️` por ícone SVG de escudo (Lucide `Shield`)

#### 2. Deixar botões do header estáticos

**Botões afetados (linhas 136-156):**
- Botão de voltar: Remover `onClick={() => navigate(-1)}` e classes de hover/active
- Botão de compartilhar (seta): Remover hover/active
- Botão carrinho: Remover `onClick={() => navigate("/product")}` e hover/active
- Botão três pontos: Remover hover/active

**Trocar `<button>` por `<div>`** para deixar claro que não são interativos

#### 3. Reduzir fonte do botão "Comprar Agora"

**Linha 505:**
- Alterar de `text-[14px]` para `text-[13px]`

---

### Detalhes Técnicos

**Novos imports necessários:**
```tsx
import { Truck, Store, MessageCircle, Shield } from "lucide-react";
```

**Ícone de Loja (baseado na referência - outline de loja):**
```tsx
<Store className="w-6 h-6 text-slate-500" />
```

**Ícone de Chat (baseado na referência - balão com carinha):**
```tsx
<MessageCircle className="w-6 h-6 text-slate-500" />
```

**Ícone de Frete (caminhão):**
```tsx
<Truck className="w-5 h-5 text-slate-500" />
```

**Header estático:**
```tsx
<div className="p-2">
  <ChevronLeft className="w-5 h-5" />
</div>
```

---

### Arquivos Modificados
- `src/pages/MounjaroPage.tsx`

---

### Resultado Esperado
- Ícones limpos no estilo da referência (sem emojis)
- Header com botões não clicáveis (apenas visuais)
- Fonte do "Comprar Agora" levemente menor para não encostar nas bordas
