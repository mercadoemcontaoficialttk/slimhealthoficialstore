

## Plano: Adicionar Imagens de Prova nas Avaliações com Modal

### Resumo
Vou adicionar as 3 imagens enviadas nas avaliações de Carlos Silva, Ana Santos e Roberto Mendes, com funcionalidade de clique para abrir em modal ampliado.

---

### 1. Copiar Imagens para o Projeto

| Imagem Origem | Destino | Avaliacao |
|---------------|---------|-----------|
| WhatsApp_Image_2026-02-04_at_12.23.23.jpeg | src/assets/reviews/carlos_prova.jpeg | Carlos Silva |
| WhatsApp_Image_2026-02-04_at_12.22.59.jpeg | src/assets/reviews/ana_prova.jpeg | Ana Santos |
| WhatsApp_Image_2026-02-04_at_12.19.36.jpeg | src/assets/reviews/roberto_prova.jpeg | Roberto Mendes |

---

### 2. Estrutura de Dados Atualizada

Adicionar campo `proofImage` opcional nas avaliações:

```typescript
const reviews = [
  {
    id: 1,
    name: "Carlos Silva",
    avatar: "...",
    stars: 5,
    text: "...",
    proofImage: carlosProva  // Nova propriedade
  },
  {
    id: 2,
    name: "Ana Santos",
    proofImage: anaProva
    // ...
  },
  // João Pereira e Fernanda Lima sem imagem
  {
    id: 5,
    name: "Roberto Mendes",
    proofImage: robertoProva
    // ...
  },
  // Lucia Ferreira sem imagem
];
```

---

### 3. Modal de Imagem Ampliada

Adicionar estado para controlar o modal:

```tsx
const [selectedImage, setSelectedImage] = useState<string | null>(null);
```

Componente do modal (overlay escuro com imagem centralizada):

```tsx
{selectedImage && (
  <div 
    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
    onClick={() => setSelectedImage(null)}
  >
    <button 
      className="absolute top-4 right-4 text-white text-3xl"
      onClick={() => setSelectedImage(null)}
    >
      ×
    </button>
    <img 
      src={selectedImage} 
      alt="Foto ampliada" 
      className="max-w-full max-h-[90vh] object-contain rounded-lg"
    />
  </div>
)}
```

---

### 4. Imagem Clicavel na Avaliacao

Renderizar a imagem de prova abaixo do texto da avaliação, apenas para reviews que tenham `proofImage`:

```tsx
{review.proofImage && (
  <img 
    src={review.proofImage} 
    alt="Foto do produto"
    className="mt-2 w-24 h-24 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity border border-slate-200"
    onClick={() => setSelectedImage(review.proofImage)}
  />
)}
```

---

### 5. Layout Visual das Avaliacoes com Imagem

```text
┌─────────────────────────────────────────────┐
│ 👤 Carlos Silva  [Compra confirmada]        │
│ ★★★★★                                       │
│ Chegou hoje! Embalagem muito bem feita...   │
│                                             │
│ ┌──────────┐                                │
│ │          │  ← Imagem 96x96px clicável     │
│ │  📷      │                                │
│ └──────────┘                                │
└─────────────────────────────────────────────┘
```

---

### 6. Imports Necessarios

```tsx
import carlosProva from "@/assets/reviews/carlos_prova.jpeg";
import anaProva from "@/assets/reviews/ana_prova.jpeg";
import robertoProva from "@/assets/reviews/roberto_prova.jpeg";
```

---

### Arquivos Modificados

| Arquivo | Alteracao |
|---------|-----------|
| src/pages/MounjaroPage.tsx | Adicionar imports, campo proofImage, estado do modal, componente modal, imagem clicável |

---

### Resultado Esperado

1. Carlos Silva, Ana Santos e Roberto Mendes terão uma foto do produto em suas avaliações
2. Ao clicar na foto, abre um modal escuro com a imagem ampliada
3. Clicar fora da imagem ou no X fecha o modal
4. Avaliações sem foto (João, Fernanda, Lucia) continuam sem imagem

