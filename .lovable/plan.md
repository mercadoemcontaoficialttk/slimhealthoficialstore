

## Plano: Ajustar Step 1 para Ficar Identico a Referencia

### Diferencas Identificadas

Comparando pixel a pixel a referencia com o codigo atual:

1. **Icone de Alerta**: Na referencia, o icone de alerta e um emoji padrao de warning (triangulo amarelo com ponto de exclamacao preto). Atualmente estamos usando um triangulo CSS customizado que parece diferente.

2. **Borda do Circulo do Icone**: Na referencia, o circulo do icone NAO tem borda visivel - e apenas um fundo amarelo claro suave. Atualmente temos `border-2 border-[#FBBF24]`.

3. **Fundo do Alerta**: Na referencia o fundo e mais suave/claro (amarelo bem claro quase creme). A cor atual esta correta mas pode ser ajustada levemente.

4. **Bordas do Botao**: Na referencia, o botao tem bordas arredondadas mas NAO e completamente pill. Parece ser aproximadamente `rounded-2xl` (mais arredondado que xl mas menos que full).

5. **Cor do Botao**: Na referencia, o botao verde parece ser um tom mais natural/organico de verde (tipo `#5ECC6B` ou similar).

6. **Espacamento Geral**: O padding do card parece maior na referencia, com mais espaco entre elementos.

7. **Sombra do Card**: Na referencia, a sombra do card parece mais suave e sutil.

---

### Mudancas em `src/pages/Index.tsx`

**Linhas 63-72 - Alerta de Escassez:**
- Remover borda do circulo do icone
- Usar emoji Unicode para o icone de warning em vez de triangulo CSS
- Ajustar tamanho do circulo para ser mais proporcional
- Cor de fundo mais suave

**Linhas 118-122 - Botao:**
- Mudar de `rounded-xl` para `rounded-2xl`
- Verificar se a cor CTA esta configurada como verde correto

**Linhas 37-38 - Card:**
- Ajustar padding do CardContent para `p-10` (mais espaco)
- Ajustar gap entre elementos para `gap-8`

---

### Detalhes Tecnicos

Arquivo: `src/pages/Index.tsx`

**Mudancas especificas:**

1. **Circulo do icone (linha 64)**:
   - Antes: `w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center border-2 border-[#FBBF24]`
   - Depois: `w-11 h-11 rounded-full bg-[#FEF3C7] flex items-center justify-center` (sem borda)

2. **Icone de alerta (linhas 65-67)**:
   - Antes: Triangulo CSS customizado com borda
   - Depois: Usar emoji warning: `<span className="text-2xl">⚠️</span>` ou um SVG de triangulo amarelo

3. **Botao (linha 118)**:
   - Antes: `rounded-xl`
   - Depois: `rounded-2xl`

4. **CardContent (linha 38)**:
   - Antes: `p-8 flex flex-col items-center gap-6`
   - Depois: `p-10 flex flex-col items-center gap-8`

---

### Codigo Final do Alerta

O alerta de escassez ficara assim:

```text
<div className="w-full border border-[#F5C842] bg-[#FFF8E7] rounded-2xl p-5 flex items-center gap-4">
  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#FEF3C7] flex items-center justify-center">
    <span className="text-2xl">⚠️</span>
  </div>
  <p className="text-base font-medium text-[#D97706]">
    Restam apenas <span className="font-bold">{STOCK_QUANTITY}</span> unidades em estoque
  </p>
</div>
```

---

### Resumo das Alteracoes

| Elemento | Antes | Depois |
|----------|-------|--------|
| Padding do card | p-8, gap-6 | p-10, gap-8 |
| Borda do circulo icone | border-2 border-[#FBBF24] | sem borda |
| Icone de alerta | Triangulo CSS | Emoji warning |
| Borda do alerta box | border-2 | border (1px) |
| Arredondamento alerta | rounded-xl | rounded-2xl |
| Arredondamento botao | rounded-xl | rounded-2xl |

