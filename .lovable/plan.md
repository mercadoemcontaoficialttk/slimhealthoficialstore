

## Plano: Icones 3D Profissionais nos Cards do Upsell 2

### Resumo
Vou transformar os icones planos (CreditCard, Info, HelpCircle) em versao 3D com efeito profissional usando sombras, gradientes e profundidade visual.

---

### Estilo Atual dos Icones

```tsx
<div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
  <CreditCard className="w-5 h-5 text-rose-500" />
</div>
```

Visual: Circulo rosa claro com icone rosa - aparencia plana

---

### Novo Estilo 3D Profissional

**Tecnicas para efeito 3D:**
1. Gradiente radial no fundo (luz vindo de cima)
2. Sombra interna (inset) para profundidade
3. Sombra externa para "flutuar"
4. Borda sutil para definicao
5. Icone com sombra drop-shadow

```tsx
<div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
  bg-gradient-to-br from-rose-100 via-rose-50 to-rose-200
  shadow-[0_4px_12px_rgba(244,63,94,0.25),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(244,63,94,0.15)]
  border border-rose-200/50">
  <CreditCard className="w-6 h-6 text-rose-500 drop-shadow-sm" />
</div>
```

---

### Detalhes do Efeito 3D

| Propriedade | Valor | Efeito Visual |
|-------------|-------|---------------|
| Tamanho | `w-12 h-12` | Icone maior, mais impactante |
| Gradiente | `from-rose-100 via-rose-50 to-rose-200` | Luz no topo, sombra embaixo |
| Sombra externa | `0_4px_12px_rgba(244,63,94,0.25)` | Flutua sobre o card |
| Sombra interna clara | `inset_0_2px_4px_rgba(255,255,255,0.8)` | Brilho no topo |
| Sombra interna escura | `inset_0_-2px_4px_rgba(244,63,94,0.15)` | Profundidade embaixo |
| Borda | `border-rose-200/50` | Definicao sutil |
| Icone | `w-6 h-6 drop-shadow-sm` | Icone maior com sombra |

---

### Arquivo Modificado

| Arquivo | Alteracao |
|---------|-----------|
| src/pages/Upsell2Page.tsx | Atualizar estilo dos 3 containers de icones (linhas 72-73, 89-90, 112-113) |

---

### Resultado Visual Esperado

```text
Antes (plano):              Depois (3D):
+--------+                  +--------+
|   ◯    |                  |  ◉    |  <- Gradiente + sombras
|        |                  |   ▼    |  <- Efeito de profundidade
+--------+                  +--------+
                                 ↓
                            Sombra externa
```

Os icones terao aparencia de botoes 3D flutuando, com luz vindo do topo esquerdo e sombra embaixo, criando um visual premium e profissional.

