

## Plano: Carrinho de Compras na Página Mounjaro

### Resumo
Vou implementar 3 funcionalidades na página do produto Mounjaro:
1. **Remover navegações que causam 404** - Botões "Loja" e "Visitar" ficarão estáticos
2. **Contador de carrinho** - Número aparece acima do ícone da loja quando adicionar produtos
3. **Comprar Agora com quantidade** - Passa a quantidade do carrinho para o checkout

---

### Alterações em `src/pages/MounjaroPage.tsx`

#### 1. Novo Estado para Carrinho
Adicionar estado para controlar a quantidade no carrinho:
```tsx
const [cartQuantity, setCartQuantity] = useState(0);
```

#### 2. Remover onClick do Botão "Visitar" (Linha 397-402)
**De:**
```tsx
<button 
  onClick={() => navigate("/product")}
  className="px-3 py-1.5 rounded-full bg-slate-100..."
>
  Visitar
</button>
```
**Para:**
```tsx
<button 
  className="px-3 py-1.5 rounded-full bg-slate-100..."
>
  Visitar
</button>
```

#### 3. Remover onClick do Botão "Loja" + Adicionar Badge (Linhas 477-483)
**De:**
```tsx
<button 
  onClick={() => navigate("/product")}
  className="flex flex-col items-center justify-center w-12 shrink-0..."
>
  <Store className="w-6 h-6 text-slate-500" />
  <span className="mt-0.5 leading-none">Loja</span>
</button>
```
**Para:**
```tsx
<button className="flex flex-col items-center justify-center w-12 shrink-0 relative...">
  <div className="relative">
    <Store className="w-6 h-6 text-slate-500" />
    {cartQuantity > 0 && (
      <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-[#ff3b66] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
        {cartQuantity}
      </span>
    )}
  </div>
  <span className="mt-0.5 leading-none">Loja</span>
</button>
```

#### 4. Adicionar Função ao Botão "Adicionar ao Carrinho" (Linha 492-494)
**De:**
```tsx
<button className="flex-1 h-11 rounded-xl bg-slate-100...">
  Adicionar ao<br />carrinho
</button>
```
**Para:**
```tsx
<button 
  onClick={() => setCartQuantity(prev => prev + 1)}
  className="flex-1 h-11 rounded-xl bg-slate-100..."
>
  Adicionar ao<br />carrinho
</button>
```

#### 5. Passar Quantidade para o Checkout no "Comprar Agora" (Linhas 497-502)
**De:**
```tsx
<button 
  onClick={() => navigate("/dados-pessoais")}
  className="flex-1 h-11 rounded-xl bg-[#ff3b66]..."
>
  Comprar Agora
</button>
```
**Para:**
```tsx
<button 
  onClick={() => {
    // Se tem itens no carrinho, usa essa quantidade; senão, compra 1 unidade
    const quantidade = cartQuantity > 0 ? cartQuantity : 1;
    localStorage.setItem('dadosPessoais', JSON.stringify({ quantidade }));
    navigate("/dados-pessoais");
  }}
  className="flex-1 h-11 rounded-xl bg-[#ff3b66]..."
>
  Comprar Agora
</button>
```

#### 6. Atualizar DadosPessoaisPage para Ler Quantidade Inicial
Em `src/pages/DadosPessoaisPage.tsx`, modificar o estado inicial da quantidade:
**De:**
```tsx
const [quantidade, setQuantidade] = useState(1);
```
**Para:**
```tsx
const [quantidade, setQuantidade] = useState(() => {
  const saved = localStorage.getItem('dadosPessoais');
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed.quantidade || 1;
  }
  return 1;
});
```

---

### Arquivos Modificados
- `src/pages/MounjaroPage.tsx` - Carrinho e botões estáticos
- `src/pages/DadosPessoaisPage.tsx` - Ler quantidade inicial do localStorage

---

### Resultado Esperado
- Botões "Loja" e "Visitar" não navegam (sem erro 404)
- Badge vermelho aparece no ícone da loja quando adicionar ao carrinho
- Ao clicar "Comprar Agora", a quantidade do carrinho é passada para o checkout
- Fluxo fluido do início ao fim sem interrupções

