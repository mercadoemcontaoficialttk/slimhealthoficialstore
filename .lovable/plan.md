

## Plano: Ajustar Step 1 para Ficar Identico a Referencia

### Diferencas Identificadas

Comparando o nosso codigo atual com a imagem de referencia:

| Elemento | Nosso (atual) | Referencia |
|----------|---------------|------------|
| Texto oferta | 2 linhas separadas: "Voce vai garantir nosso produto" + "em condicao especial." | 1 linha: "Voce vai garantir nosso produto" em preto bold + "em" em cinza na mesma linha, depois "condicao especial." em cinza |
| Texto alerta | Todo em laranja (#D97706) | Texto principal em PRETO, apenas "19" em amarelo/laranja |
| Botao | rounded-2xl, h-12 | Mais alto (~h-14), cantos mais suaves, verde mais vibrante |

---

### Mudancas em `src/pages/Index.tsx`

**1. Texto da Oferta (linhas 57-64):**

O layout na referencia mostra:
- "Voce vai garantir nosso produto" em preto bold
- "em" comeca na mesma linha em cinza
- "condicao especial." na linha abaixo em cinza

Estrutura atual separada em 2 `<p>` nao reproduz isso. Preciso usar spans inline:

```text
<p className="text-center text-2xl md:text-3xl">
  <span className="font-bold text-black">Voce vai garantir nosso produto </span>
  <span className="text-gray-500">em</span>
</p>
<p className="text-center text-2xl md:text-3xl text-gray-500">
  condicao especial.
</p>
```

**2. Texto do Alerta (linhas 71-73):**

Na referencia, o texto do alerta e:
- "Restam apenas" em PRETO
- "19" em AMARELO/LARANJA e bold
- "unidades em estoque" em PRETO

Atualmente tudo esta em laranja (#D97706). Mudar para:

```text
<p className="text-base font-medium text-black">
  Restam apenas <span className="font-bold text-[#D97706]">{STOCK_QUANTITY}</span> unidades em estoque
</p>
```

**3. Botao Continuar (linhas 117-127):**

Na referencia o botao parece:
- Mais alto (h-14 em vez de h-12)
- Cantos mais arredondados (rounded-3xl)
- Verde mais suave/vibrante

Mudar altura para `h-14` e arredondamento para `rounded-3xl`.

---

### Detalhes Tecnicos

Arquivo: `src/pages/Index.tsx`

**Linha 57-64 - Texto da Oferta:**
```text
Antes:
<div className="text-center">
  <p className="text-2xl md:text-3xl font-bold text-black">
    Voce vai garantir nosso produto
  </p>
  <p className="text-2xl md:text-3xl text-gray-500">
    em condicao especial.
  </p>
</div>

Depois:
<div className="text-center">
  <p className="text-2xl md:text-3xl">
    <span className="font-bold text-black">Voce vai garantir nosso produto </span>
    <span className="text-gray-500">em</span>
  </p>
  <p className="text-2xl md:text-3xl text-gray-500">
    condicao especial.
  </p>
</div>
```

**Linha 71-73 - Texto do Alerta:**
```text
Antes:
<p className="text-base font-medium text-[#D97706]">
  Restam apenas <span className="font-bold">{STOCK_QUANTITY}</span> unidades em estoque
</p>

Depois:
<p className="text-base font-medium text-black">
  Restam apenas <span className="font-bold text-[#D97706]">{STOCK_QUANTITY}</span> unidades em estoque
</p>
```

**Linha 120 - Botao:**
```text
Antes:
className={`w-full h-12 text-lg font-semibold rounded-2xl ...

Depois:
className={`w-full h-14 text-lg font-semibold rounded-3xl ...
```

---

### Resumo das Alteracoes

| Elemento | Antes | Depois |
|----------|-------|--------|
| Texto oferta linha 1 | Todo em preto bold | "produto " em preto + "em" em cinza na mesma linha |
| Texto alerta | Todo em laranja | Preto com apenas "19" em laranja |
| Altura botao | h-12 | h-14 |
| Arredondamento botao | rounded-2xl | rounded-3xl |

