

## Plano: Adicionar Logos no Header e Corrigir Imagem do Produto

### Resumo
Vou fazer duas alterações:
1. Adicionar as logos SlimHealth + CIMED pequenas no lado direito do header nas 3 páginas de checkout
2. Reverter a imagem do produto na página de confirmação para `object-contain` (como estava antes)

---

### Estrutura Visual do Header

```text
┌────────────────────────────────────────────────────────────┐
│ < │ Dados pessoais          [SlimHealth] + [CIMED] │
└────────────────────────────────────────────────────────────┘
```

As logos ficarão:
- Altura de 5 (h-5) - pequenas para não chamar atenção
- Opacidade 70% - discretas
- Alinhadas à direita
- Na mesma linha do título

---

### Arquivos a Modificar

1. **`src/pages/DadosPessoaisPage.tsx`**
2. **`src/pages/EnderecoPage.tsx`**
3. **`src/pages/ConfirmacaoPage.tsx`**

---

### Detalhes Técnicos

#### 1. Adicionar Imports das Logos (em cada arquivo)
```tsx
import slimHealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";
```

#### 2. Modificar Header (estrutura igual nas 3 páginas)

**De (exemplo DadosPessoaisPage, linha 90-95):**
```tsx
<div className="h-14 flex items-center gap-3">
  <button onClick={() => navigate(-1)} className="p-1">
    <ChevronLeft className="w-6 h-6 text-slate-700" />
  </button>
  <h1 className="text-lg font-semibold text-slate-900">Dados pessoais</h1>
</div>
```

**Para:**
```tsx
<div className="h-14 flex items-center gap-3">
  <button onClick={() => navigate(-1)} className="p-1">
    <ChevronLeft className="w-6 h-6 text-slate-700" />
  </button>
  <h1 className="text-lg font-semibold text-slate-900 flex-1">Dados pessoais</h1>
  
  {/* Logos */}
  <div className="flex items-center gap-1 opacity-70">
    <img src={slimHealthLogo} alt="SlimHealth" className="h-5 w-auto" />
    <span className="text-slate-400 text-xs">+</span>
    <img src={cimedLogo} alt="CIMED" className="h-5 w-auto" />
  </div>
</div>
```

#### 3. Corrigir Imagem do Produto na Confirmação (Linha 182)

**De:**
```tsx
<img src={foto1} alt="Mounjaro" className="w-full h-full object-cover" />
```

**Para:**
```tsx
<img src={foto1} alt="Mounjaro" className="w-full h-full object-contain" />
```

---

### Alterações por Arquivo

| Arquivo | Alteração |
|---------|-----------|
| `DadosPessoaisPage.tsx` | + imports logos, + logos no header |
| `EnderecoPage.tsx` | + imports logos, + logos no header |
| `ConfirmacaoPage.tsx` | + imports logos, + logos no header, reverter object-contain |

---

### Resultado Esperado
- Logos SlimHealth + CIMED pequenas e discretas no canto direito do header
- Alinhadas perfeitamente na mesma linha do título
- Imagem do produto na confirmação volta ao tamanho proporcional correto
- Visual consistente nas 3 páginas de checkout

