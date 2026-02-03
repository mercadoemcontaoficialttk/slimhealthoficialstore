

## Plano: Roleta de Premios CIMED

### Visao Geral

Criar uma roleta de premios interativa que aparece apos o passo 3 (idade). A roleta tera o tema visual da CIMED (amarelo) e seguira uma logica programada:
1. Primeiro giro: cai em "Tente novamente"
2. Segundo giro: cai em "96% de desconto"

---

### Estrutura da Roleta

**Segmentos da roleta (8 segmentos):**
1. 20% de desconto
2. Tente novamente
3. 40% de desconto
4. Carmed
5. 96% de desconto (premio final)
6. Tente novamente
7. 30% de desconto
8. Frete Gratis

---

### Arquivos a Criar/Modificar

**1. Novo componente: `src/components/PrizeWheel.tsx`**

Componente da roleta com:
- Canvas/SVG para desenhar a roleta circular
- Segmentos coloridos alternando entre amarelo CIMED (#F5C842) e branco/cinza claro
- Logo CIMED no centro da roleta
- Seta indicadora no topo
- Animacao de rotacao com easing (desacelera no final)
- Som de tique-taque durante a rotacao (usando Web Audio API ou arquivo de audio)

**Logica do componente:**
```text
Estados:
- isSpinning: boolean (se esta girando)
- spinCount: number (quantas vezes girou - 0, 1, 2)
- currentRotation: number (angulo atual)
- result: string | null (resultado do giro)

Funcao spinWheel():
- Se spinCount === 0: calcula angulo para cair em "Tente novamente"
- Se spinCount === 1: calcula angulo para cair em "96% de desconto"
- Anima a rotacao com CSS transition ou requestAnimationFrame
- Toca som de roleta durante a animacao
```

**2. Novo arquivo de audio: Usar Web Audio API**

Para o som da roleta, usar a Web Audio API para gerar um som de "tick" sintetico:
```text
- Criar oscillator com frequencia curta
- Tocar multiplos ticks durante a rotacao
- Frequencia dos ticks diminui conforme a roleta desacelera
```

**3. Modificar: `src/pages/Index.tsx`**

Adicionar step 4 (roleta):
```text
Estados adicionais:
- step agora vai de 1 a 4
- hasWon: boolean (se ganhou o premio final)

Logica atualizada:
- Step 3 -> Ao clicar continuar, vai para step 4 (roleta)
- Step 4 -> Mostra a roleta, apos ganhar vai para /checkout
```

**4. Modificar: `tailwind.config.ts`**

Adicionar keyframe de rotacao da roleta:
```text
keyframes: {
  "spin-wheel": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(var(--spin-degrees))" }
  }
}
```

---

### Layout Visual do Step 4 (Roleta)

```text
+----------------------------------+
|                                  |
|      Gire e ganhe seu           |
|         desconto!               |
|                                 |
|          [SETA v]               |
|     +---------------+           |
|    /                 \          |
|   |    [ROLETA]      |          |
|   |   [CIMED LOGO]   |          |
|    \                 /          |
|     +---------------+           |
|                                 |
|      [ GIRAR ROLETA ]           |
|                                 |
|   (resultado aparece aqui)      |
+----------------------------------+
```

---

### Cores CIMED para a Roleta

| Elemento | Cor |
|----------|-----|
| Segmentos primarios | #F5C842 (amarelo CIMED) |
| Segmentos secundarios | #FFFFFF (branco) |
| Texto dos segmentos | #1a1a2e (escuro) |
| Borda da roleta | #D4A934 (amarelo mais escuro) |
| Botao girar | #F5C842 (amarelo CIMED) |

---

### Fluxo de Interacao

```text
1. Usuario completa step 3 (idade)
   |
   v
2. Clica "Continuar" -> vai para step 4
   |
   v
3. Ve a roleta com botao "GIRAR ROLETA"
   |
   v
4. Clica no botao -> roleta gira com som
   |
   v
5. Para em "Tente novamente" -> mostra mensagem
   |
   v
6. Botao muda para "TENTAR NOVAMENTE"
   |
   v
7. Clica novamente -> roleta gira
   |
   v
8. Para em "96% de desconto" -> celebracao!
   |
   v
9. Mostra mensagem de parabens + botao "RESGATAR PREMIO"
   |
   v
10. Clica -> navega para /checkout
```

---

### Som da Roleta (Web Audio API)

```text
Implementacao sintetica (sem arquivo externo):
- Criar AudioContext
- Durante a rotacao, tocar "ticks" com oscillator
- Frequencia: comeca rapido (50ms entre ticks)
- Desacelera conforme a roleta para (ate 200ms entre ticks)
- Som tipo "click" curto (10-20ms de duracao cada)
```

---

### Resumo das Alteracoes

| Arquivo | Acao |
|---------|------|
| src/components/PrizeWheel.tsx | Criar (novo componente da roleta) |
| src/pages/Index.tsx | Modificar (adicionar step 4 com roleta) |
| tailwind.config.ts | Modificar (adicionar keyframe de spin) |
| src/index.css | Modificar (adicionar estilos da roleta se necessario) |

---

### Detalhes Tecnicos

**Calculo do angulo de parada:**
- Cada segmento = 360 / 8 = 45 graus
- "Tente novamente" (segmento 2): posicao 45-90 graus
- "96% de desconto" (segmento 5): posicao 180-225 graus
- Adicionar multiplas rotacoes completas (3-5 voltas) + angulo final
- Usar cubic-bezier para efeito de desaceleracao natural

**Animacao da roleta:**
- Duracao: 4-6 segundos
- Easing: cubic-bezier(0.17, 0.67, 0.12, 0.99) (desacelera suavemente)
- Rotacoes totais: minimo 1440 graus (4 voltas) + offset do premio

