

## Plano: Ajustar Modal e Texto da Oferta para Ficar Igual a Referencia

### Diferencas Identificadas

Comparando com a imagem de referencia:

| Elemento | Nosso (atual) | Referencia |
|----------|---------------|------------|
| Tamanho texto | `text-2xl md:text-3xl` (24-30px) | Menor, aproximadamente `text-xl md:text-2xl` (20-24px) |
| Card arredondamento | `rounded-lg` (padrao do Card) | Bordas mais arredondadas e suaves (`rounded-2xl` ou `rounded-3xl`) |
| Sombra do Card | `shadow-lg` | Sombra mais suave e elegante (`shadow-xl` com opacidade reduzida) |

---

### Mudancas Necessarias

**1. Arquivo `src/pages/Index.tsx`**

**Card (linha 37):**
- Adicionar bordas mais arredondadas: `rounded-2xl` ou `rounded-3xl`
- Ajustar sombra para ficar mais suave: `shadow-xl`

Antes:
```text
<Card className="w-full max-w-md shadow-lg animate-fade-in">
```

Depois:
```text
<Card className="w-full max-w-md shadow-xl rounded-3xl animate-fade-in">
```

**Texto da Oferta (linhas 58-64):**
- Reduzir tamanho da fonte de `text-2xl md:text-3xl` para `text-xl md:text-2xl`
- Manter a mesma estrutura de cores

Antes:
```text
<p className="text-2xl md:text-3xl">
  <span className="font-bold text-black">Voce vai garantir nosso produto </span>
  <span className="text-gray-500">em</span>
</p>
<p className="text-2xl md:text-3xl text-gray-500">
  condicao especial.
</p>
```

Depois:
```text
<p className="text-xl md:text-2xl">
  <span className="font-bold text-black">Voce vai garantir nosso produto </span>
  <span className="text-gray-500">em</span>
</p>
<p className="text-xl md:text-2xl text-gray-500">
  condicao especial.
</p>
```

---

### Detalhes Tecnicos

Arquivo: `src/pages/Index.tsx`

**Linha 37 - Card:**
```text
Antes: <Card className="w-full max-w-md shadow-lg animate-fade-in">
Depois: <Card className="w-full max-w-md shadow-xl rounded-3xl animate-fade-in">
```

**Linhas 58-64 - Texto da Oferta:**
```text
Antes: text-2xl md:text-3xl (duas ocorrencias)
Depois: text-xl md:text-2xl (duas ocorrencias)
```

---

### Resumo das Alteracoes

| Elemento | Antes | Depois |
|----------|-------|--------|
| Arredondamento Card | rounded-lg (padrao) | rounded-3xl |
| Sombra Card | shadow-lg | shadow-xl |
| Tamanho fonte oferta | text-2xl md:text-3xl | text-xl md:text-2xl |

