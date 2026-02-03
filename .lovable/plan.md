

## Plano: Ajustes Visuais na Roleta + Confetes

### Visao Geral

Implementar cinco melhorias na roleta:
1. Alterar tom de cores para rgb(247,194,23)
2. Garantir que a roleta pare exatamente no 96%
3. Remover emojis do card de celebracao
4. Alterar fonte das letras para estilo CIMED (sans-serif elegante)
5. Adicionar confetes caindo quando ganhar

---

### Mudancas em `src/components/PrizeWheel.tsx`

#### 1. Alterar Tom de Cores para rgb(247,194,23)

**Cor CIMED:** `rgb(247, 194, 23)` = `#F7C217`

**Locais a alterar:**

| Antes | Depois |
|-------|--------|
| `#FFD700` | `#F7C217` |
| `#FFA500` | `#E5B015` (tom mais escuro) |
| `#FF8C00` | `#D4A012` (tom ainda mais escuro) |

**Gradientes a atualizar:**
- `goldSegment`: usar tons de #F7C217
- `pinGradient`: usar tons de #F7C217
- Borda externa: usar #F7C217
- Glow effect: usar rgba(247,194,23,0.4)

---

#### 2. Parar Exatamente no 96%

**Problema atual:** A roleta pode nao parar exatamente no centro do segmento 96%.

**Solucao:** Ajustar o calculo do angulo de parada para garantir precisao.

O segmento 96% esta no indice 4. Com 8 segmentos de 45 graus cada:
- Inicio do segmento: 4 * 45 = 180 graus
- Centro do segmento: 180 + 22.5 = 202.5 graus (a partir do topo)

**Codigo ajustado:**
```text
// O ponteiro esta no topo (0 graus)
// Para o ponteiro apontar para o centro do segmento 4:
const segmentCenterAngle = targetSegmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;

// Rotacao final = rotacoes extras + ajuste para alinhar
const targetRotation = rotation + extraRotations + (360 - segmentCenterAngle + 90);
```

O `+ 90` compensa o offset de -90 usado no desenho dos segmentos.

---

#### 3. Remover Emojis do Card de Celebracao

**Linha 439-440:**

```text
Antes:
🎰 Você ganhou 96% de desconto! 🎰

Depois:
Você ganhou 96% de desconto!
```

---

#### 4. Fonte Estilo CIMED nas Letras da Roleta

**Fonte CIMED:** A logo CIMED usa uma fonte sans-serif bold, moderna e limpa.

**Solucao:** Usar fonte que se assemelhe ao estilo CIMED:

```text
Antes:
fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif"

Depois:
fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
fontWeight: 800
letterSpacing: "0.05em"
```

Tambem aumentar levemente o tamanho e ajustar o espacamento para melhor legibilidade.

---

#### 5. Adicionar Confetes Quando Ganhar

**Implementacao:** Criar animacao CSS de confetes que caem do topo quando `showCelebration` for true.

**Tecnica:**
- Criar 20-30 elementos de confete com posicoes aleatorias
- Usar keyframes CSS para animacao de queda
- Cores: tons de dourado, branco, e cor CIMED
- Duracao: 3-4 segundos
- Iniciar automaticamente quando showCelebration = true

**Estrutura do componente de confetes:**
```text
{showCelebration && (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
    {confettiPieces.map((piece) => (
      <div 
        key={piece.id}
        className="absolute animate-confetti-fall"
        style={{
          left: `${piece.x}%`,
          animationDelay: `${piece.delay}s`,
          backgroundColor: piece.color,
        }}
      />
    ))}
  </div>
)}
```

**Keyframes necessarios (adicionar ao index.css ou inline):**
```text
@keyframes confetti-fall {
  0% {
    transform: translateY(-10vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}
```

---

### Resumo das Alteracoes

| Item | Mudanca |
|------|---------|
| Cores | Alterar de #FFD700 para #F7C217 (cor CIMED) |
| Gradientes | Atualizar goldSegment, pinGradient com novos tons |
| Glow | Usar rgba(247,194,23,0.4) |
| Parada 96% | Ajustar calculo de angulo com +90 offset |
| Emojis | Remover "emoji de roleta" do card |
| Fonte | Mudar para Segoe UI/Roboto com peso 800 |
| Confetes | Adicionar animacao de confetes caindo |

---

### Arquivos a Modificar

| Arquivo | Acao |
|---------|------|
| src/components/PrizeWheel.tsx | Todas as alteracoes acima |
| src/index.css | Adicionar keyframes de confete (opcional, pode ser inline) |

