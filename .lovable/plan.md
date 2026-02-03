
## Plano: Ajustar Texto e Botao para Ficar Mais Estetico

### Mudancas Identificadas

Baseado nas imagens de referencia enviadas, preciso fazer 3 ajustes:

| Elemento | Atual | Solicitado |
|----------|-------|------------|
| Tamanho texto oferta | `text-xl md:text-2xl` | Menor para nao encostar nas laterais |
| Arredondamento botao | `rounded-3xl` (muito arredondado) | Menos arredondado (`rounded-2xl`) |
| Peso da fonte botao | `font-semibold` | Mais grosso (`font-bold`) |

---

### Mudancas em `src/pages/Index.tsx`

**1. Texto da Oferta (linhas 58-63)**

Reduzir tamanho da fonte de `text-xl md:text-2xl` para `text-lg md:text-xl`:

Antes:
```text
<p className="text-xl md:text-2xl whitespace-nowrap">
```

Depois:
```text
<p className="text-lg md:text-xl whitespace-nowrap">
```

E na segunda linha tambem:
Antes:
```text
<p className="text-xl md:text-2xl text-gray-500">
```

Depois:
```text
<p className="text-lg md:text-xl text-gray-500">
```

**2. Botao Continuar (linha 121)**

Reduzir arredondamento de `rounded-3xl` para `rounded-2xl` e aumentar peso da fonte de `font-semibold` para `font-bold`:

Antes:
```text
className={`w-full h-14 text-lg font-semibold rounded-3xl transition-all...
```

Depois:
```text
className={`w-full h-14 text-lg font-bold rounded-2xl transition-all...
```

---

### Resumo das Alteracoes

| Elemento | Antes | Depois |
|----------|-------|--------|
| Tamanho fonte texto | text-xl md:text-2xl | text-lg md:text-xl |
| Arredondamento botao | rounded-3xl | rounded-2xl |
| Peso fonte botao | font-semibold | font-bold |
