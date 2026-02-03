

## Plano: Diminuir Margem e Ajustar Texto para 2 Linhas

### Diferenca Identificada

Comparando os dois prints:

| Aspecto | Nosso (atual) | Referencia |
|---------|---------------|------------|
| Layout texto | 3 linhas: "Voce vai garantir nosso produto" + "em" + "condicao especial." | 2 linhas: "Voce vai garantir nosso produto em" + "condicao especial." |
| Problema | O "em" esta quebrando para uma linha separada | O "em" fica na mesma linha que "produto" |

O problema e que o texto esta quebrando em 3 linhas em vez de 2. Na referencia, "Voce vai garantir nosso produto em" fica tudo na mesma linha.

---

### Solucao

Precisamos ajustar a estrutura do texto para que "em" fique junto com "produto" na mesma linha. A solucao e unir tudo em uma unica estrutura de 2 linhas forcadas:

**Linha 1:** "Voce vai garantir nosso produto em" (preto bold + cinza)
**Linha 2:** "condicao especial." (cinza)

---

### Mudancas em `src/pages/Index.tsx`

**Linhas 57-64 - Texto da Oferta:**

Antes:
```text
<div className="text-center">
  <p className="text-xl md:text-2xl">
    <span className="font-bold text-black">Voce vai garantir nosso produto </span>
    <span className="text-gray-500">em</span>
  </p>
  <p className="text-xl md:text-2xl text-gray-500">
    condicao especial.
  </p>
</div>
```

Depois:
```text
<div className="text-center">
  <p className="text-xl md:text-2xl">
    <span className="font-bold text-black">Voce vai garantir nosso produto </span>
    <span className="text-gray-500">em</span>
  </p>
  <p className="text-xl md:text-2xl text-gray-500">
    condicao especial.
  </p>
</div>
```

Na verdade, a estrutura esta correta. O problema e que a largura do container ou o tamanho da fonte esta fazendo o "em" quebrar. Vou adicionar `whitespace-nowrap` na primeira linha para forcar que fique tudo junto:

```text
<div className="text-center">
  <p className="text-xl md:text-2xl whitespace-nowrap">
    <span className="font-bold text-black">Voce vai garantir nosso produto </span>
    <span className="text-gray-500">em</span>
  </p>
  <p className="text-xl md:text-2xl text-gray-500">
    condicao especial.
  </p>
</div>
```

---

### Resumo das Alteracoes

| Elemento | Antes | Depois |
|----------|-------|--------|
| Primeira linha texto | Pode quebrar em 2 linhas | `whitespace-nowrap` para manter em 1 linha |
| Layout final | 3 linhas | 2 linhas (igual referencia) |

