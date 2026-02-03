

## Plano: Logo Estatica + Textos 3D Profissionais

### Visao Geral

Implementar tres melhorias visuais na roleta:
1. Manter a logo CIMED no centro estatica (nao gira com a roleta)
2. Aplicar efeito 3D com relevo nos textos dos segmentos
3. Alterar texto do botao de "RESGATAR PRÊMIO" para "RESGATAR DESCONTO"

---

### Mudancas em `src/components/PrizeWheel.tsx`

#### 1. Logo CIMED Estatica (Nao Gira)

**Problema atual:** A logo esta dentro do div que gira, entao gira junto com a roleta.

**Solucao:** Mover a logo para FORA do div da roleta que gira, posicionando-a de forma absoluta sobre o centro da roleta.

**Estrutura atual:**
```text
<div style={{ transform: rotate(rotation) }}> <- DIV QUE GIRA
  <svg>segmentos</svg>
  <div>LOGO CIMED</div> <- DENTRO, GIRA JUNTO
</div>
```

**Nova estrutura:**
```text
<div className="relative"> <- CONTAINER
  <div style={{ transform: rotate(rotation) }}> <- DIV QUE GIRA
    <svg>segmentos</svg>
  </div>
  <div>LOGO CIMED</div> <- FORA, NAO GIRA (z-index alto)
</div>
```

---

#### 2. Textos 3D com Relevo Profissional

**Tecnica:** Usar filtros SVG para criar efeito de relevo/emboss nos textos.

**Implementacao:**
- Adicionar `<defs>` com filtro SVG para efeito 3D
- O filtro inclui:
  - Sombra projetada para profundidade
  - Efeito de bevel/relevo com luz especular
  - Gradiente sutil para aparencia metalica

**Codigo do filtro SVG:**
```text
<defs>
  <filter id="emboss" x="-20%" y="-20%" width="140%" height="140%">
    <!-- Sombra escura embaixo -->
    <feDropShadow dx="0.3" dy="0.3" stdDeviation="0.1" flood-color="#000" flood-opacity="0.5"/>
    <!-- Luz clara em cima -->
    <feDropShadow dx="-0.2" dy="-0.2" stdDeviation="0.1" flood-color="#fff" flood-opacity="0.4"/>
  </filter>
</defs>
```

**Aplicar nos textos:**
```text
<text filter="url(#emboss)" ...>
```

**Fonte mais impactante:**
- Aumentar tamanho para `6px`
- Usar `font-weight: 900` (extra bold)
- Manter `'Arial Black'` como fonte principal

---

#### 3. Alterar Texto do Botao

**Linha 151:**
```text
Antes:
if (showCelebration) return "RESGATAR PRÊMIO";

Depois:
if (showCelebration) return "RESGATAR DESCONTO";
```

---

### Detalhes Tecnicos

#### Estrutura HTML Atualizada do Container da Roleta

```text
<div className="relative" style={{ perspective: "1000px" }}>
  {/* Anel decorativo externo */}
  <div className="absolute -inset-3 ..." />
  <div className="absolute -inset-2 ..." />
  
  {/* Ponteiro */}
  <div className="absolute top-0 ..." />

  {/* Roleta que gira */}
  <div style={{ transform: rotate(rotation) }}>
    <svg>
      <defs>
        <filter id="emboss">...</filter>
      </defs>
      {segmentos com texto filter="url(#emboss)"}
    </svg>
  </div>

  {/* Logo CIMED - FORA da roleta, nao gira */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
    <img src={cimedLogo} ... />
  </div>
</div>
```

---

### Efeito Visual do Texto 3D

O filtro SVG cria:
- Sombra escura na parte inferior/direita (profundidade)
- Reflexo claro na parte superior/esquerda (luz)
- Resultado: texto com aparencia de relevo/elevado

---

### Resumo das Alteracoes

| Local | Mudanca |
|-------|---------|
| Linhas 275-295 | Mover logo para fora do div que gira |
| Linha 207 | Adicionar `<defs>` com filtro emboss |
| Linhas 250-268 | Aplicar `filter="url(#emboss)"` nos textos |
| Linha 151 | Alterar "RESGATAR PRÊMIO" para "RESGATAR DESCONTO" |

---

### Arquivo a Modificar

| Arquivo | Acao |
|---------|------|
| src/components/PrizeWheel.tsx | Todas as alteracoes acima |

