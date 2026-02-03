

## Plano: Roleta 3D Profissional com Imagem Carmed

### Visao Geral

Transformar a roleta atual em uma versao mais profissional com efeito 3D, substituir o texto "Carmed" pela imagem do produto enviada, e reduzir o tamanho dos textos para evitar vazamento.

---

### Mudancas a Implementar

#### 1. Copiar Imagem Carmed para o Projeto

Copiar a imagem enviada para `src/assets/carmed-product.jpg` para uso no componente.

---

#### 2. Modificar `src/components/PrizeWheel.tsx`

**A. Adicionar efeito 3D na roleta:**

| Efeito | Implementacao |
|--------|---------------|
| Sombra profunda | `box-shadow` com multiplas camadas |
| Borda metalica | Gradiente radial na borda |
| Perspectiva 3D | `transform-style: preserve-3d` |
| Reflexo sutil | Pseudo-elemento com gradiente |
| Iluminacao | Sombra interna e externa |

**Estilos 3D a adicionar:**
```text
- Sombra externa: 0 10px 30px rgba(0,0,0,0.3)
- Sombra interna: inset 0 -5px 15px rgba(0,0,0,0.1)
- Borda metalica: gradiente de #D4A934 para #F5C842 para #D4A934
- Anel externo decorativo com efeito de profundidade
```

**B. Substituir segmento "Carmed" por imagem:**

No segmento index 3 (Carmed), ao inves de renderizar texto, renderizar a imagem do produto Carmed usando `<image>` dentro do SVG ou posicionamento absoluto.

**C. Reduzir tamanho dos textos:**

Alterar de `text-[5px]` para `text-[4px]` e ajustar o `dy` do tspan de `6` para `4.5` para melhor espaçamento.

---

### Estrutura Visual 3D

```text
    +-- Anel externo decorativo (gradiente dourado) --+
    |                                                  |
    |  +-- Borda metalica com gradiente 3D --+        |
    |  |                                     |        |
    |  |        [ROLETA PRINCIPAL]           |        |
    |  |        com sombras internas         |        |
    |  |                                     |        |
    |  |           [CENTRO CIMED]            |        |
    |  |           com elevacao 3D           |        |
    |  |                                     |        |
    |  +-------------------------------------+        |
    |                                                  |
    +--------------------------------------------------+
```

---

### Detalhes Tecnicos

**Efeito 3D no container da roleta:**
```text
Classes/Estilos:
- Sombra multicamada: shadow-[0_10px_40px_rgba(0,0,0,0.3),0_5px_15px_rgba(0,0,0,0.2)]
- Borda gradiente: usar div wrapper com gradiente
- Anel externo: div adicional com borda maior e gradiente
```

**Imagem Carmed no SVG:**
```text
- Usar elemento <image> dentro do SVG
- Posicionar no centro do segmento
- Aplicar clipPath para manter dentro do segmento
- Tamanho reduzido para caber no segmento
```

**Texto menor:**
```text
Antes: fontSize: "5px", dy: "6"
Depois: fontSize: "4px", dy: "4"
```

---

### Resumo das Alteracoes

| Arquivo | Acao |
|---------|------|
| src/assets/carmed-product.jpg | Copiar imagem do usuario |
| src/components/PrizeWheel.tsx | Adicionar efeitos 3D, imagem Carmed, texto menor |

---

### Resultado Esperado

- Roleta com aparencia profissional e tridimensional
- Segmento "Carmed" mostrando a imagem do produto
- Textos menores que nao vazam dos segmentos
- Visual mais condizente com campanha CIMED/Carmed

