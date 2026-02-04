

## Plano: Corrigir Pagina de Rastreio

### Visao Geral
Corrigir 3 pontos na pagina de rastreio conforme solicitado:
1. Corrigir campo `estado` para `uf` no endereco
2. Deixar botoes estaticos (sem acao)
3. Exibir resumo completo do pedido incluindo bumps e upsells

---

### 1. Correcao do Campo Estado/UF

**Problema:** Na pagina de Endereco, o campo e salvo como `uf`, mas na pagina de Rastreio estou buscando `endereco.estado`.

**Solucao:** Alterar de `endereco.estado` para `endereco.uf`:

```tsx
// Antes (linha 202)
{endereco.bairro} - {endereco.cidade}/{endereco.estado}

// Depois
{endereco.bairro} - {endereco.cidade}/{endereco.uf}
```

---

### 2. Botoes Estaticos

**Problema:** Os botoes "Precisa de Ajuda?" e "Voltar para Loja" redirecionam o lead para outros locais.

**Solucao:** Remover os `onClick` e manter apenas visualmente, ou substituir por texto estatico sem acao.

**Opcao escolhida:** Manter os botoes visualmente, mas remover a navegacao e trocar os textos para algo mais neutro:

```tsx
// Antes
<Button onClick={() => window.open('https://wa.me/...', '_blank')}>
  Precisa de Ajuda?
</Button>

<Button onClick={() => navigate("/")}>
  Voltar para Loja
</Button>

// Depois - Sem onClick, apenas visual estatico
<div className="flex items-center justify-center gap-2 text-emerald-600 font-medium py-3">
  <HelpCircle className="w-5 h-5" />
  Em caso de duvidas, entre em contato conosco
</div>
```

Ou simplesmente remover os botoes e deixar apenas o badge de seguranca.

---

### 3. Resumo Completo do Pedido

**Problema:** O resumo mostra apenas Mounjaro + frete, mas nao inclui:
- Order Bumps (canetas, kit, aula)
- Valores dos Upsells (Up 1, 2, 3, 4)

**Solucao:** Recuperar e exibir todos os itens do pedido:

```tsx
// Recuperar pedido completo
const pedidoData = JSON.parse(localStorage.getItem('pedido') || '{}');

// O objeto pedido tem:
// - produto: { quantidade, subtotal }
// - frete
// - bumps: array dos bumps selecionados
// - valorBumps
// - total
```

**Nova estrutura do resumo:**

```text
+------------------------------------+
|  Resumo do Pedido                  |
|                                    |
|  Mounjaro 5mg x 2       R$ 135,80  |
|  Canetas Aplicadoras    R$  89,90  |  <- Se bump selecionado
|  Kit Transporte         R$  29,90  |  <- Se bump selecionado
|  Frete (JADLOG)         R$  15,90  |
|  ---------------------------       |
|  Subtotal               R$ 271,50  |
|  ---------------------------       |
|  Upsell 1 - ...         R$  XX,XX  |  <- Se pago
|  Upsell 2 - ...         R$  XX,XX  |  <- Se pago
|  Upsell 3 - Frete       R$  35,90  |  <- Se pago
|  Upsell 4 - Reembolso   R$  35,20  |  <- Se pago
|  ---------------------------       |
|  TOTAL GERAL            R$ XXX,XX  |
+------------------------------------+
```

**Nota:** Para exibir os upsells, precisamos salvar cada upsell pago no localStorage. Atualmente isso nao esta sendo feito. Posso adicionar isso nas paginas de upsell ou calcular baseado na rota.

---

### 4. Arquivos a Modificar

| Arquivo | Acao |
|---------|------|
| src/pages/RastreioPage.tsx | EDITAR - Corrigir uf, remover botoes, exibir resumo completo |

---

### 5. Detalhes da Implementacao

**Card de Endereco corrigido:**
```tsx
<p className="text-sm text-gray-600">
  {endereco.bairro} - {endereco.cidade}/{endereco.uf}
</p>
```

**Botoes estaticos (opcao 1 - remover completamente):**
Remover os dois Button e deixar apenas o badge de seguranca e os logos.

**Botoes estaticos (opcao 2 - texto informativo):**
```tsx
<p className="text-sm text-gray-500 text-center">
  Em caso de duvidas, entre em contato pelo email suporte@slimhealth.com.br
</p>
```

**Resumo do pedido expandido:**
```tsx
<div className="space-y-2 text-sm">
  {/* Produto principal */}
  <div className="flex justify-between">
    <span className="text-gray-600">
      Mounjaro 5mg {pedido.produto?.quantidade ? `x ${pedido.produto.quantidade}` : ''}
    </span>
    <span className="font-medium text-gray-800">
      {formatPrice(pedido.produto?.subtotal || 0)}
    </span>
  </div>

  {/* Bumps - se existirem */}
  {pedido.bumps?.map((bump: any) => (
    <div key={bump.id} className="flex justify-between">
      <span className="text-gray-600">{bump.nome}</span>
      <span className="font-medium text-gray-800">
        {formatPrice(bump.precoPromocional)}
      </span>
    </div>
  ))}

  {/* Frete */}
  <div className="flex justify-between">
    <span className="text-gray-600">Frete ({getShippingLabel()})</span>
    <span className="font-medium text-gray-800">
      {frete.price === 0 ? 'Gratis' : formatPrice(frete.price || 0)}
    </span>
  </div>

  <div className="border-t border-gray-200 my-3" />

  {/* Total */}
  <div className="flex justify-between">
    <span className="font-bold text-[#1a1a2e]">Total</span>
    <span className="font-bold text-emerald-600 text-lg">
      {formatPrice(pedido.total || 0)}
    </span>
  </div>
</div>
```

---

### 6. Correcao do Campo Frete

**Problema adicional identificado:** Na pagina de Endereco, o frete e salvo com `valor`, mas na pagina de Rastreio busco `frete.price`.

```tsx
// EnderecoPage salva:
localStorage.setItem('frete', JSON.stringify({
  tipo: freteSelecionado,
  nome: freteAtual?.nome,
  prazo: freteAtual?.prazo,
  valor: valorFrete  // <-- Campo correto e "valor"
}));

// RastreioPage busca:
frete.price  // <-- Deveria ser frete.valor
```

**Correcao:**
```tsx
// Antes
{frete.price === 0 ? 'Gratis' : formatPrice(frete.price || 0)}

// Depois
{frete.valor === 0 ? 'Gratis' : formatPrice(frete.valor || 0)}
```

---

### 7. Resumo das Correcoes

| Local | Antes | Depois |
|-------|-------|--------|
| Linha 202 | `endereco.estado` | `endereco.uf` |
| Linha 234 | `frete.price === 0` | `frete.valor === 0` |
| Linha 234 | `frete.price` | `frete.valor` |
| Linha 243 | `frete.price` | `frete.valor` |
| Linhas 259-275 | Botoes com onClick | Texto estatico ou remocao |
| Card Resumo | Apenas produto + frete | Produto + bumps + frete |

---

### Resultado Esperado

1. Endereco exibido corretamente com UF do lead
2. Botoes sem acao - lead permanece na pagina
3. Resumo completo com todos os itens comprados
4. Frete exibido corretamente (gratis ou valor)
5. Visual profissional mantido

