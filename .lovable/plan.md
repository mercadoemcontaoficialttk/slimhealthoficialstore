

## Plano: Ajustes Finais na Página de Dados Pessoais

### Resumo
Vou fazer 4 ajustes conforme solicitado para deixar a página igual à referência.

---

### Alterações

#### 1. Cor do Botão "Continuar" (Verde → Rosa)
Quando o formulário estiver válido, o botão ficará rosa igual ao valor do subtotal.

**De:**
```tsx
isFormValid ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ...
```

**Para:**
```tsx
isFormValid ? 'bg-rose-500 text-white hover:bg-rose-600' : ...
```

---

#### 2. Layout do Botão (Não Ocupar Largura Total)
Remover o `flex-1` e adicionar uma largura fixa para o botão ficar à direita sem ocupar todo o espaço.

**De:**
```tsx
<button className="flex-1 h-12 rounded-full ...">
```

**Para:**
```tsx
<button className="px-12 h-12 rounded-full ...">
```

---

#### 3. Badges de Segurança Menores
Reduzir o tamanho dos ícones e texto dos badges de segurança.

**De:**
```tsx
<ShieldCheck className="w-5 h-5" />
<span>Compra Segura</span>
```

**Para:**
```tsx
<ShieldCheck className="w-4 h-4" />
<span className="text-xs">Compra Segura</span>
```

---

#### 4. Preço do Produto Dinâmico (Card Superior)
Atualizar o preço no card do produto para mostrar o subtotal calculado, não apenas o preço unitário fixo.

**De:**
```tsx
<div className="mt-1 text-lg font-bold text-emerald-600">
  R$ {formatPrice(PRECO_UNITARIO)}
</div>
```

**Para:**
```tsx
<div className="mt-1 text-lg font-bold text-emerald-600">
  R$ {formatPrice(subtotal)}
</div>
```

---

### Arquivo Modificado
- `src/pages/DadosPessoaisPage.tsx`

---

### Resultado Esperado
- Botão "Continuar" rosa quando habilitado (igual ao valor)
- Botão com tamanho fixo à direita, não ocupando toda a largura
- Badges de segurança menores e discretos
- Preço no card superior se soma quando adiciona mais produtos

