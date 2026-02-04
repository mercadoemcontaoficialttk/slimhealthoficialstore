

## Plano: Atualizar Imagens dos Order Bumps e PIX

### Resumo
Vou substituir as imagens dos order bumps e do PIX com as imagens corretas fornecidas, e expandir as imagens para preencher melhor os quadrados sem espaços em branco.

---

### Imagens a Copiar

| Destino | Origem | Uso |
|---------|--------|-----|
| `src/assets/bumps/canetas.webp` | Imagem das canetas Mounjaro | Primeiro order bump |
| `src/assets/bumps/kit-transporte.webp` | Imagem da bolsa térmica azul | Segundo order bump |
| `src/assets/bumps/aula-play.jpg` | Imagem do botão play azul | Terceiro order bump |
| `src/assets/pix-logo.png` | Logo PIX oficial | Forma de pagamento |

---

### Alteracoes em `src/pages/ConfirmacaoPage.tsx`

#### 1. Atualizar Imports (Linhas 4-6)
```tsx
import foto1 from "@/assets/mounjaro/foto1.png";
import canetasImg from "@/assets/bumps/canetas.webp";
import kitTransporteImg from "@/assets/bumps/kit-transporte.webp";
import aulaPlayImg from "@/assets/bumps/aula-play.jpg";
import pixLogo from "@/assets/pix-logo.png";
```

#### 2. Atualizar Order Bumps com Novas Imagens (Linhas 58-87)
```tsx
const orderBumps: OrderBump[] = [
  {
    id: 'canetas',
    nome: '+2 Canetas Aplicadoras Premium',
    descricao: 'Continue seu tratamento sem interrupções',
    precoOriginal: 129.90,
    precoPromocional: 89.90,
    desconto: '-31%',
    imagem: canetasImg,
    badge: 'MAIS VENDIDO'
  },
  {
    id: 'kit',
    nome: 'Kit Transporte Refrigerado',
    descricao: 'Bolsa térmica para levar aonde for',
    precoOriginal: 49.90,
    precoPromocional: 29.90,
    desconto: '-40%',
    imagem: kitTransporteImg
  },
  {
    id: 'aula',
    nome: 'Aula Exclusiva de Aplicação',
    descricao: 'Aprenda a aplicar como um profissional',
    precoOriginal: 39.90,
    precoPromocional: 19.90,
    desconto: '-50%',
    imagem: aulaPlayImg
  }
];
```

#### 3. Expandir Imagem do Item do Pedido (Linha 179-181)
**De:**
```tsx
<div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100">
  <img src={foto1} alt="Mounjaro" className="w-full h-full object-contain" />
</div>
```
**Para:**
```tsx
<div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100">
  <img src={foto1} alt="Mounjaro" className="w-full h-full object-cover" />
</div>
```

#### 4. Expandir Imagens dos Order Bumps (Linha 281-283)
**De:**
```tsx
<div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100">
  <img src={bump.imagem} alt={bump.nome} className="w-full h-full object-contain" />
</div>
```
**Para:**
```tsx
<div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-slate-100">
  <img src={bump.imagem} alt={bump.nome} className="w-full h-full object-cover" />
</div>
```

#### 5. Expandir Logo do PIX (Linha 337-339)
**De:**
```tsx
<div className="w-12 h-8 shrink-0">
  <img src={pixLogo} alt="PIX" className="w-full h-full object-contain" />
</div>
```
**Para:**
```tsx
<div className="w-14 h-10 shrink-0">
  <img src={pixLogo} alt="PIX" className="w-full h-full object-contain" />
</div>
```

---

### Arquivos Modificados/Criados

| Arquivo | Acao |
|---------|------|
| `src/assets/bumps/canetas.webp` | Copiar imagem das canetas |
| `src/assets/bumps/kit-transporte.webp` | Copiar imagem do kit transporte |
| `src/assets/bumps/aula-play.jpg` | Copiar imagem do botao play |
| `src/assets/pix-logo.png` | Substituir pela logo PIX oficial |
| `src/pages/ConfirmacaoPage.tsx` | Atualizar imports e tamanhos de imagem |

---

### Detalhes Tecnicos

**object-contain vs object-cover:**
- `object-contain`: Mantem proporcao, pode deixar espacos vazios
- `object-cover`: Preenche todo o espaco, pode cortar bordas

Para as imagens dos order bumps e item do pedido, usar `object-cover` fara com que preencham completamente o quadrado sem espacos em branco.

---

### Resultado Esperado
- Imagem das canetas Mounjaro no primeiro order bump
- Imagem da bolsa termica azul no segundo order bump
- Imagem do botao play azul no terceiro order bump
- Logo PIX oficial na forma de pagamento
- Todas as imagens preenchendo os quadrados sem espacos vazios

