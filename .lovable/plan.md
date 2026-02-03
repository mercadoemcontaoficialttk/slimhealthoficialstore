


## Plano: Ajustar Texto e Logo para Ficar Identico a Referencia

### Diferencas Identificadas

Comparando os prints fornecidos:

**Texto "Voce vai garantir nosso produto em condicao especial.":**

| Aspecto | Nosso (atual) | Referencia |
|---------|---------------|------------|
| Layout | 3 linhas (texto quebrando em "produto") | 2 linhas bem definidas |
| Linha 1 | "Voce vai garantir nosso" | "Voce vai garantir nosso produto" |
| Linha 2 | "produto em condicao" | "em condicao especial." |
| Tamanho | text-xl md:text-2xl | Parece ser maior (~text-2xl md:text-3xl) |
| Estrutura | Tudo em um `<p>` com spans | Deve ser 2 elementos separados para controlar quebra |

**Logo SlimHealth:**
- Atual: `h-16 md:h-20` (64-80px)
- Referencia: Precisa ser maior para equilibrar visualmente com CIMED (~h-20 md:h-24)

---

### Mudancas em `src/pages/Index.tsx`

**Linhas 57-60 - Texto da Oferta:**

Estrutura atual:
```text
<p className="text-center text-xl md:text-2xl">
  <span className="font-bold">Voce vai garantir nosso produto </span>
  <span className="text-gray-500">em condicao especial.</span>
</p>
```

Nova estrutura (2 linhas separadas):
```text
<div className="text-center">
  <p className="text-2xl md:text-3xl font-bold text-black">
    Voce vai garantir nosso produto
  </p>
  <p className="text-2xl md:text-3xl text-gray-500">
    em condicao especial.
  </p>
</div>
```

Isso garante:
1. Cada frase fica em sua propria linha
2. Tamanho maior do texto (text-2xl md:text-3xl)
3. Primeira linha em preto/bold
4. Segunda linha em cinza

**Linhas 43-47 - Logo SlimHealth:**

Mudanca:
- Antes: `h-16 md:h-20`
- Depois: `h-20 md:h-24` (logo maior para melhor proporcao visual)

---

### Detalhes Tecnicos

Arquivo: `src/pages/Index.tsx`

**1. Logo SlimHealth (linha 46):**
- Antes: `className="h-16 md:h-20 object-contain"`
- Depois: `className="h-20 md:h-24 object-contain"`

**2. Texto da Oferta (linhas 57-60):**
Substituir o `<p>` atual por:
```text
<div className="text-center">
  <p className="text-2xl md:text-3xl font-bold text-black">
    Voce vai garantir nosso produto
  </p>
  <p className="text-2xl md:text-3xl text-gray-500">
    em condicao especial.
  </p>
</div>
```

---

### Resumo das Alteracoes

| Elemento | Antes | Depois |
|----------|-------|--------|
| Logo SlimHealth | h-16 md:h-20 | h-20 md:h-24 |
| Estrutura texto | 1 `<p>` com spans | 2 `<p>` separados dentro de div |
| Tamanho texto | text-xl md:text-2xl | text-2xl md:text-3xl |
| Quebra de linha | Automatica (3 linhas) | Forcada (2 linhas) |


