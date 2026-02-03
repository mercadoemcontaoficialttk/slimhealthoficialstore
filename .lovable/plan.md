
## Plano: Criar Pagina de Produto Estilo TikTok Shop

### Visao Geral

Criar uma nova pagina de produto (`/product`) que sera exibida apos o passo 3 (confirmacao de idade) do funil. A pagina tera o visual identico ao arquivo `index-2.html` fornecido, adaptado para o produto Carmed atual.

---

### Estrutura da Pagina

#### 1. Header Sticky
- Botao voltar (seta para esquerda)
- Botao compartilhar
- Botao carrinho
- Botao menu (kebab)

#### 2. Galeria de Imagens
- Carrossel horizontal com snap scroll
- Contador de imagens (1/3)
- Setas de navegacao (desktop)

#### 3. Secao de Preco/Oferta Relampago
- Gradiente rosa/laranja
- Badge de desconto (-96%)
- Preco atual grande (R$ 67,90)
- Preco antigo riscado
- Icone de raio + "Oferta Relampago"
- Countdown timer

#### 4. Secao de Informacoes
- Faixa promocional rosa
- Titulo do produto com selo 11.11
- Rating (estrelas) + vendidos
- Informacoes de frete gratis + prazo de entrega

#### 5. Secao Protecao do Cliente
- Fundo bege com icone de escudo
- Lista de beneficios (devolucao, reembolso, etc.)

#### 6. Secao de Avaliacoes
- Resumo com nota 4.9/5
- Lista de avaliacoes com avatar, nome, estrelas e texto
- Chips de tags

#### 7. Secao Loja do Vendedor
- Avatar da loja + nome + selo verificado
- Botao "Visitar"

#### 8. Secao Sobre o Produto
- Grid de detalhes (produto, principio ativo, etc.)
- Descricao longa

#### 9. Secao Recomendados
- Grid 2 colunas com produtos similares

#### 10. Barra de Acao Fixa (Bottom)
- Botao Loja
- Botao Chat
- Botao "Adicionar ao carrinho"
- Botao "Comprar Agora" (rosa)

---

### Adaptacoes para o Projeto

| Original | Adaptacao |
|----------|-----------|
| Mounjaro (medicamento) | Carmed (produto atual) |
| Imagens externas | Usar imagem `carmed-product.jpg` |
| PHP forms | Navegacao React Router |
| Scripts vanilla JS | React hooks (useState, useEffect) |
| Tailwind CDN | Tailwind config existente |

---

### Arquivos a Criar/Modificar

| Arquivo | Acao |
|---------|------|
| `src/pages/ProductPage.tsx` | Criar nova pagina de produto |
| `src/App.tsx` | Adicionar rota `/product` |
| `src/pages/Index.tsx` | Alterar navegacao do passo 3 para `/product` |

---

### Componentes React a Implementar

```text
ProductPage
├── Header (sticky)
├── ImageGallery (carrossel com useState para index)
├── FlashPriceSection (com useEffect para countdown)
├── InfoSection (titulo, rating, frete)
├── CustomerProtection
├── ReviewsSection
├── SellerShop
├── AboutProduct
├── RecommendedProducts
└── ActionBar (fixed bottom)
```

---

### Funcionalidades JavaScript a Converter

1. **Countdown Timer**: useEffect com setInterval
2. **Image Carousel**: useState para indice + scroll snap CSS
3. **Sticky Tabs**: IntersectionObserver com useRef
4. **Dynamic Delivery Date**: Calculo com date-fns

---

### Fluxo Atualizado

| Passo | Conteudo | Acao do Botao |
|-------|----------|---------------|
| 1 | Landing page com logos e alerta | Ir para passo 2 |
| 2 | Captura de nome | Ir para passo 3 |
| 3 | Confirmacao de idade | Ir para /product (NOVO) |
| - | Pagina de Produto | Comprar Agora -> /checkout |

---

### Secao Tecnica

#### CSS Customizado Necessario
- `.clamp-2` e `.clamp-3` para truncar texto
- `.no-scrollbar` para esconder scrollbar
- Gradiente `from-[#ff3b66] via-[#ff5a5f] to-[#ff8a3d]`

#### Icones a Usar (Lucide React)
- ChevronLeft, ChevronRight (navegacao)
- ShoppingCart, Share, MoreHorizontal (header)
- Star (avaliacoes)
- Shield, Truck, MessageCircle (protecao/frete/chat)
- Zap (oferta relampago)

#### Dados Mockados
- 3 avaliacoes de clientes
- Detalhes do produto Carmed
- Lista de produtos recomendados (pode ser estatica inicialmente)

---

### Estimativa de Linhas
- ProductPage.tsx: ~600-800 linhas (componente completo)
- Modificacoes menores em App.tsx e Index.tsx
