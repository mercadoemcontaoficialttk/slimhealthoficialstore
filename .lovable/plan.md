

## Plano: Ajustar Step 1 para Corresponder Exatamente a Referencia

### Diferencas Identificadas

Comparando o codigo atual com a imagem de referencia:

1. **Texto da oferta**: Atualmente usa `<br />` para quebrar a linha, mas na referencia o texto flui naturalmente em duas linhas sem quebra forcada. O texto "em condicao especial." deve ter cor cinza clara, nao preta.

2. **Botao "Continuar"**: Atualmente tem `rounded-full` (muito arredondado como pilula). Na referencia, o botao tem bordas arredondadas mais moderadas (`rounded-xl` ou `rounded-2xl`).

3. **Icone de alerta**: O icone atual e muito simples. Na referencia, o triangulo de alerta tem um estilo mais definido com fundo circular amarelo claro e o triangulo com exclamacao mais proeminente.

4. **Texto do alerta**: Na referencia, o texto e maior e mais legivel (aproximadamente `text-base` em vez de `text-sm`).

---

### Mudancas em `src/pages/Index.tsx`

**Linha 57-61 - Texto da oferta:**
```text
Antes:
- Usa <br /> para quebrar linha
- Texto "em condicao especial." na mesma cor

Depois:
- Remover <br /> e deixar fluir naturalmente
- "em condicao especial." em cor cinza: text-gray-500
```

**Linha 64-71 - Alerta de escassez:**
```text
Antes:
- Icone AlertTriangle simples
- Texto text-sm

Depois:
- Circulo amarelo claro com borda
- Triangulo de alerta maior e mais definido
- Texto text-base para melhor leitura
- Padding maior para mais espaco
```

**Linha 117 - Botao:**
```text
Antes:
- rounded-full (pilula completa)

Depois:
- rounded-xl (arredondamento moderado como na referencia)
```

---

### Detalhes Tecnicos

Arquivo a modificar: `src/pages/Index.tsx`

Mudancas especificas:

1. Linhas 57-61: Reformatar texto para fluxo natural
2. Linhas 64-71: Ajustar estilo do alerta e icone
3. Linha 117: Trocar `rounded-full` por `rounded-xl`

