

## Plano: Melhorias Visuais na Roleta

### Visao Geral

Aplicar melhorias visuais na roleta para deixar o design mais profissional: textos laterais (radiais), fonte mais elegante, imagem Carmed rotacionada, remover emoji do titulo e ajustar o giro para apenas um que cai em 96%.

---

### Mudancas em `src/components/PrizeWheel.tsx`

#### 1. Textos Laterais (Radiais) nos Segmentos

**Situacao atual:** Os textos estao rotacionados +90 graus, ficando "de cabeca para baixo" ou frontais.

**Solucao:** Alterar a rotacao do texto para que fiquem alinhados radialmente (apontando para fora do centro), como em roletas profissionais de cassino.

| Antes | Depois |
|-------|--------|
| `textRotation = (startAngle + endAngle) / 2 + 90` | `textRotation = (startAngle + endAngle) / 2` |

Isso faz os textos ficarem laterais, seguindo a direcao do segmento.

---

#### 2. Fonte Mais Profissional

**Mudancas:**
- Aumentar levemente o tamanho da fonte de `4px` para `5px`
- Usar `font-family: 'Arial Black', sans-serif` ou fonte bold mais impactante
- Adicionar `letter-spacing` para espacamento entre letras

```text
Antes:
style={{ fontSize: "4px" }}
className="font-bold fill-[#1a1a2e]"

Depois:
style={{ fontSize: "5px", fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif", letterSpacing: "0.02em" }}
className="fill-[#1a1a2e]"
```

---

#### 3. Imagem Carmed Rotacionada Lateralmente

**Situacao atual:** A imagem usa `textRotation` que estava +90 graus.

**Solucao:** Usar a mesma rotacao radial dos textos para a imagem ficar lateral tambem.

```text
Antes:
transform={`rotate(${textRotation}, ${textX}, ${textY})`}
// onde textRotation = midAngle + 90

Depois:
transform={`rotate(${(startAngle + endAngle) / 2}, ${textX}, ${textY})`}
// rotacao radial sem o +90
```

---

#### 4. Remover Emoji e Aumentar Titulo "Parabens"

**Linha 163-164 - Titulo:**

```text
Antes:
<h2 className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mb-2">
  {showCelebration ? "🎉 Parabéns!" : "Gire e ganhe seu desconto!"}
</h2>

Depois:
<h2 className="text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-2">
  {showCelebration ? "Parabéns!" : "Gire e ganhe seu desconto!"}
</h2>
```

**Mudancas:**
- Remover emoji `🎉`
- Aumentar fonte de `text-2xl md:text-3xl` para `text-3xl md:text-4xl`

---

#### 5. Apenas Um Giro que Cai em 96%

**Logica atual (linhas 98-142):**
- `spinCount >= 2` bloqueia apos 2 giros
- Primeiro giro: cai em "Tente novamente" (index 1)
- Segundo giro: cai em "96%" (index 4)

**Nova logica:**
- `spinCount >= 1` bloqueia apos 1 giro
- Unico giro: cai direto em "96% de desconto" (index 4)
- Remover logica de "Tente novamente"

```text
Antes:
if (isSpinning || spinCount >= 2) return;
const targetSegmentIndex = spinCount === 0 ? 1 : 4;

Depois:
if (isSpinning || spinCount >= 1) return;
const targetSegmentIndex = 4; // Sempre 96% de desconto
```

---

#### 6. Giro Mais Lento

**Situacao atual:** Duracao de 5 segundos.

**Solucao:** Aumentar para 7 segundos para um giro mais dramatico.

```text
Antes:
const spinDuration = 5000; // 5 seconds
transition: isSpinning ? "transform 5s cubic-bezier(...)"

Depois:
const spinDuration = 7000; // 7 seconds
transition: isSpinning ? "transform 7s cubic-bezier(...)"
```

---

#### 7. Atualizar Texto do Botao

Como agora so tem 1 giro, remover o texto "TENTAR NOVAMENTE":

```text
Antes:
if (spinCount === 1 && !isSpinning) return "TENTAR NOVAMENTE";

Depois:
// Remover esta linha (nao havera segunda tentativa)
```

---

### Resumo das Alteracoes

| Item | Mudanca |
|------|---------|
| Rotacao dos textos | Remover +90 para ficarem radiais/laterais |
| Fonte | Maior (5px) e mais profissional (Arial Black) |
| Imagem Carmed | Rotacao radial igual aos textos |
| Titulo "Parabens" | Remover emoji, fonte maior |
| Numero de giros | De 2 para 1 |
| Alvo do giro | Sempre 96% de desconto |
| Duracao do giro | De 5s para 7s |
| Botao | Remover opcao "Tentar novamente" |

---

### Arquivo a Modificar

| Arquivo | Mudancas |
|---------|----------|
| src/components/PrizeWheel.tsx | Todas as alteracoes acima |

