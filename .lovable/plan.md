

## Plano: Remover Borda do Header no Upsell 1

### Resumo
Remover a linha/borda que aparece abaixo do logo TikTok Shop no header da página Upsell 1 para um visual mais limpo.

---

### Alteracao Necessaria

**Linha 54 - Atual:**
```tsx
<div className="bg-white border-b border-gray-200 px-4 py-4 flex justify-center">
```

**Novo (sem borda):**
```tsx
<div className="bg-white px-4 py-4 flex justify-center">
```

---

### Padrao Visual para Upsells Futuros

Documentar o padrao visual estabelecido para consistencia em todos os upsells:

| Elemento | Estilo |
|----------|--------|
| Fundo da pagina | `bg-white` |
| Header | Sem borda (`border-b` removido) |
| Titulo principal | `font-extrabold text-[#1a1a2e]` |
| Cards | `bg-white rounded-2xl shadow-lg p-6` |
| Botao principal | `bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl shadow-lg font-bold` |
| Logos rodape | SlimHealth + CIMED centralizadas, `opacity-70` |

---

### Arquivo Modificado

| Arquivo | Alteracao |
|---------|-----------|
| src/pages/Upsell1Page.tsx | Remover `border-b border-gray-200` do header |

---

### Resultado Visual

```text
+------------------------------------------+
|         [TikTok Shop Logo]               |  <- Sem linha embaixo
|                                          |
|              Parabéns!                   |
|                                          |
```

