
## Plano: Corrigir Navegação do Funil

### Resumo
O lead, após confirmar sua idade no Step 3, está sendo direcionado para `/product` que gera um erro 404. Vou corrigir para que ele vá diretamente para `/mounjaro`, que é a página do produto principal.

---

### Alteração

**Arquivo:** `src/pages/Index.tsx` (linha 24)

**De:**
```tsx
navigate("/product"); // Ir para página de produto
```

**Para:**
```tsx
navigate("/mounjaro"); // Ir para página do Mounjaro
```

---

### Arquivos Modificados
- `src/pages/Index.tsx`

---

### Resultado Esperado
O fluxo do funil ficará fluido:
1. **Step 1:** Usuário vê a oferta e clica em continuar
2. **Step 2:** Usuário digita o nome e clica em continuar
3. **Step 3:** Usuário confirma a idade e clica em continuar
4. **Redirecionamento:** Vai direto para `/mounjaro` (página do produto Mounjaro)

Isso elimina o erro 404 e mantém o projeto fluido do início ao fim.
