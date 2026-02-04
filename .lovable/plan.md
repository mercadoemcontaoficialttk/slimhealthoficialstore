

## Plano: Corrigir Barra de Progresso e Padronizar Header da PixPage

### Problema Identificado
A barra de progresso na página de Pagamento PIX está usando o componente `<Progress />` que tem estilos diferentes das outras páginas. Nas outras páginas de checkout, a barra é feita com divs simples.

### Diferenças Encontradas

| Aspecto | PixPage (atual) | Outras páginas (correto) |
|---------|-----------------|--------------------------|
| Componente | `<Progress />` | `<div>` simples |
| Altura | `h-2` | `h-1` |
| Cor | Preta (padrão) | `bg-rose-500` |

---

### Alteracoes Necessarias

**Arquivo:** `src/pages/PixPage.tsx`

#### 1. Remover import do Progress
```tsx
// Remover esta linha:
import { Progress } from "@/components/ui/progress";
```

#### 2. Substituir a barra de progresso
**De (linhas 109-112):**
```tsx
{/* Progress bar */}
<div className="mt-3">
  <Progress value={100} className="h-2 bg-gray-200" />
</div>
```

**Para:**
```tsx
{/* Progress Bar - 100% */}
<div className="h-1 bg-slate-200 mt-3">
  <div className="h-full w-full bg-rose-500" />
</div>
```

---

### Resultado Esperado
- Barra de progresso com altura `h-1` (mesma das outras paginas)
- Cor rosa (`bg-rose-500`) igual as outras paginas
- Barra 100% preenchida indicando etapa final do checkout
- Visual consistente em todo o fluxo de checkout

