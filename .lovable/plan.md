

## Plano: Remover páginas /product e /checkout

### Resumo
Vou remover as rotas `/product` e `/checkout` do projeto, incluindo seus arquivos de página correspondentes.

---

### Alterações

#### 1. Atualizar `src/App.tsx`
- Remover imports:
  - `import ProductPage from "./pages/ProductPage";`
  - `import Checkout from "./pages/Checkout";`
- Remover rotas:
  - `<Route path="/product" element={<ProductPage />} />`
  - `<Route path="/checkout" element={<Checkout />} />`

#### 2. Deletar arquivos de página
- `src/pages/ProductPage.tsx`
- `src/pages/Checkout.tsx`

---

### Resultado
O projeto terá apenas as rotas:
- `/` → Index (página inicial)
- `/mounjaro` → MounjaroPage
- `*` → NotFound (404)

