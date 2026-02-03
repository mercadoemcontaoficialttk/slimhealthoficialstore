

## Plano: Redesign da Roleta Estilo Cassino Las Vegas

### Visao Geral

Redesenhar completamente a roleta para ter um visual profissional estilo cassino Las Vegas, mantendo as informacoes da CIMED e a funcionalidade de parar em 96% de desconto.

---

### Principais Mudancas Visuais

#### 1. Design de Roleta Estilo Cassino

**Elementos inspirados em roletas de cassino:**

| Elemento | Implementacao |
|----------|---------------|
| Borda externa decorativa | Multiplos aneis com efeito metalico dourado/prateado |
| Pinos/marcadores | Pequenos circulos dourados entre cada segmento na borda |
| Iluminacao LED | Efeito de brilho/glow nas bordas |
| Segmentos alternados | Cores vibrantes alternando (vermelho/dourado ou amarelo/branco) |
| Centro elevado | Botao central com efeito 3D pronunciado |
| Ponteiro premium | Seta metalica com sombra e brilho |

---

#### 2. Estrutura Visual Atualizada

```text
    +-- Anel externo com pinos decorativos --+
    |  o   o   o   o   o   o   o   o        |
    |                                        |
    | +-- Borda metalica dourada 3D --+     |
    | |                               |     |
    | |    [SEGMENTOS COLORIDOS]      |     |
    | |    com bordas douradas        |     |
    | |                               |     |
    | |       [CENTRO CIMED]          |     |
    | |       estatico + 3D           |     |
    | |                               |     |
    | +-------------------------------+     |
    |                                        |
    +----------------------------------------+
```

---

### Modificacoes em `src/components/PrizeWheel.tsx`

#### A. Nova Borda Externa com Pinos Decorativos

Adicionar um anel externo com pequenos circulos dourados (pinos) posicionados entre cada segmento, simulando o visual classico de roletas de cassino:

```text
- Anel mais externo: borda grossa dourada com gradiente metalico
- Pinos: 8 circulos dourados (1 por segmento) com efeito 3D
- Brilho: sombra luminosa dourada ao redor
```

#### B. Segmentos com Visual Premium

**Cores mais vibrantes:**
- Segmentos amarelos: gradiente de #FFD700 para #FFA500 (dourado rico)
- Segmentos brancos: gradiente de #FFFFFF para #F5F5F5 com brilho

**Bordas entre segmentos:**
- Linhas douradas mais grossas (#B8860B)
- Efeito de profundidade nas divisorias

#### C. Ponteiro Estilo Cassino

Redesenhar o ponteiro para parecer mais premium:
- Formato de seta mais elaborado
- Gradiente metalico dourado/vermelho
- Sombra pronunciada
- Pequeno circulo no topo

#### D. Centro Premium (Logo CIMED Estatica)

O centro ja esta estatico, mas melhorar o visual:
- Borda dourada mais grossa com gradiente 3D
- Sombra mais pronunciada para parecer elevado
- Efeito de metal polido no fundo

#### E. Efeito de Iluminacao/Brilho

Adicionar um "glow" sutil ao redor da roleta para simular iluminacao de cassino:
- Box-shadow com cor dourada/amarela
- Animacao sutil de pulso quando parada

---

### Codigo SVG Atualizado

**Novos elementos a adicionar no SVG:**

1. **Pinos decorativos na borda:**
```text
<circle cx="..." cy="..." r="3" fill="url(#goldGradient)" stroke="#8B7500" />
```

2. **Gradientes para efeito metalico:**
```text
<linearGradient id="goldGradient">
  <stop offset="0%" stopColor="#FFE082" />
  <stop offset="50%" stopColor="#FFD700" />
  <stop offset="100%" stopColor="#B8860B" />
</linearGradient>
```

3. **Segmentos com gradiente:**
```text
<linearGradient id="yellowSegment">
  <stop offset="0%" stopColor="#FFD700" />
  <stop offset="100%" stopColor="#FFA500" />
</linearGradient>
```

---

### Estrutura de Camadas

```text
1. Camada mais externa: Glow/brilho dourado (blur)
2. Anel com pinos: Circulos dourados decorativos
3. Borda metalica: Gradiente dourado 3D
4. Segmentos da roleta: Cores vibrantes com bordas
5. Centro estatico: Logo CIMED com efeito 3D
6. Ponteiro: Seta premium no topo (z-index alto)
```

---

### Mantendo Funcionalidade Existente

| Item | Status |
|------|--------|
| Logo CIMED estatica no centro | Mantido |
| 8 segmentos com mesmas informacoes | Mantido |
| Imagem Carmed no segmento 3 | Mantido |
| Giro parando em 96% de desconto | Mantido |
| Duracao de 7 segundos | Mantido |
| Som de tique-taque | Mantido |
| Apenas 1 giro permitido | Mantido |

---

### Resumo das Alteracoes

| Area | Mudanca |
|------|---------|
| Borda externa | Adicionar anel com pinos decorativos dourados |
| Segmentos | Usar gradientes mais vibrantes |
| Bordas dos segmentos | Linhas douradas mais grossas |
| Ponteiro | Redesenho premium estilo cassino |
| Centro | Manter estatico, melhorar efeito 3D |
| Iluminacao | Adicionar glow dourado ao redor |
| Gradientes SVG | Novos gradientes metalicos |

---

### Arquivo a Modificar

| Arquivo | Acao |
|---------|------|
| src/components/PrizeWheel.tsx | Redesign completo da parte visual |

