

## Plano: Ajustes Visuais na Página Upsell 1

### Resumo das Alterações
Vou fazer 5 ajustes visuais na página Upsell 1 conforme solicitado:

1. Fundo da página todo branco (remover gradiente cinza)
2. Card de aviso (amarelo) com estilo igual ao card de NF (branco com sombra)
3. Remover o emoji do "Parabéns!"
4. Deixar "Parabéns" mais grosso (usar `font-extrabold` como na Index)
5. Adicionar logos SlimHealth + CIMED centralizadas no final

---

### 1. Fundo da Página Todo Branco

**Atual:**
```tsx
<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col">
```

**Novo:**
```tsx
<div className="min-h-screen bg-white flex flex-col">
```

---

### 2. Card de Aviso com Estilo Branco e Sombra

**Atual (amarelo):**
```tsx
<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
  <p className="text-amber-800 text-sm leading-relaxed">
```

**Novo (branco com sombra):**
```tsx
<div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
  <p className="text-gray-700 text-sm leading-relaxed">
```

---

### 3. Remover Emoji do "Parabéns!"

**Atual:**
```tsx
<h1 className="text-3xl font-bold text-gray-800 mb-2">
  Parabéns! 🎉
</h1>
```

**Novo:**
```tsx
<h1 className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mb-2">
  Parabéns!
</h1>
```

---

### 4. "Parabéns" Mais Grosso (Referência Index)

Usando o mesmo estilo da página Index:
- `font-extrabold` (ao invés de `font-bold`)
- Cor `text-[#1a1a2e]` para combinar com o estilo do projeto
- Tamanhos responsivos `text-2xl md:text-3xl`

---

### 5. Logos SlimHealth + CIMED no Final

Adicionar as logos após o card de aviso, centralizadas:

```tsx
{/* Logos SlimHealth + CIMED */}
<div className="flex items-center justify-center gap-3 mt-8">
  <img 
    src={slimhealthLogo} 
    alt="SlimHealth" 
    className="h-7 object-contain opacity-70"
  />
  <span className="text-lg font-bold text-muted-foreground">+</span>
  <img 
    src={cimedLogo} 
    alt="CIMED" 
    className="h-5 object-contain opacity-70"
  />
</div>
```

---

### Imports Adicionais

```tsx
import slimhealthLogo from "@/assets/slimhealth-logo.png";
import cimedLogo from "@/assets/cimed-logo.png";
```

---

### Arquivo Modificado

| Arquivo | Alterações |
|---------|------------|
| src/pages/Upsell1Page.tsx | Fundo branco, card aviso branco, remover emoji, título mais grosso, adicionar logos |

---

### Resultado Visual Esperado

```text
+------------------------------------------+
|         [TikTok Shop Logo]               |  ← Header branco
+------------------------------------------+
|                                          |
|              Parabéns!                   |  ← Sem emoji, font-extrabold
|                                          |
|  Você acabou de garantir seu produto...  |
|                                          |
+------------------------------------------+
|  +------------------------------------+  |
|  |  NF-e (Taxa de Emissão de NF)     |  |  ← Card branco com sombra
|  |        R$ 47,89                    |  |
|  +------------------------------------+  |
|                                          |
|  [  Efetuar pagamento da Taxa  ]         |
|                                          |
|  +------------------------------------+  |
|  | Atenção: Para receber seu produto |  |  ← Card branco com sombra (antes era amarelo)
|  | do TikTok Shop...                  |  |
|  +------------------------------------+  |
|                                          |
|       [SlimHealth] + [CIMED]             |  ← Logos pequenas, centralizadas
|                                          |
+------------------------------------------+
        Fundo todo BRANCO (bg-white)
```

