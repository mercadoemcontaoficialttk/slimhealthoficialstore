

## Plano: Ajustar Tamanho da Logo SlimHealth e Corrigir Texto do Order Bump

### Resumo
Vou fazer duas alterações simples:
1. Aumentar o tamanho da logo SlimHealth no header das 3 páginas (de `h-5` para `h-7`)
2. Corrigir o texto da descrição da "Aula Exclusiva de Aplicação"

---

### Alterações

#### 1. Aumentar Logo SlimHealth (3 arquivos)

A logo da CIMED está com `h-5` e está boa. A SlimHealth também está `h-5` mas aparece menor porque a imagem tem proporções diferentes. Vou aumentar a SlimHealth para `h-7` para equilibrar visualmente.

**Arquivos:**
- `src/pages/DadosPessoaisPage.tsx`
- `src/pages/EnderecoPage.tsx`
- `src/pages/ConfirmacaoPage.tsx`

**De:**
```tsx
<img src={slimHealthLogo} alt="SlimHealth" className="h-5 w-auto" />
```

**Para:**
```tsx
<img src={slimHealthLogo} alt="SlimHealth" className="h-7 w-auto" />
```

---

#### 2. Corrigir Texto do Order Bump "Aula Exclusiva"

**Arquivo:** `src/pages/ConfirmacaoPage.tsx` (linha 85)

**De:**
```tsx
descricao: 'Aprenda a aplicar como um profissional',
```

**Para:**
```tsx
descricao: 'Aprenda a aplicar com um profissional da área',
```

---

### Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `DadosPessoaisPage.tsx` | Logo SlimHealth `h-5` → `h-7` |
| `EnderecoPage.tsx` | Logo SlimHealth `h-5` → `h-7` |
| `ConfirmacaoPage.tsx` | Logo SlimHealth `h-5` → `h-7` + texto do bump corrigido |

---

### Resultado Esperado
- Logo SlimHealth ficará maior e mais proporcional à logo CIMED
- Texto da aula exclusiva: "Aprenda a aplicar com um profissional da área"

