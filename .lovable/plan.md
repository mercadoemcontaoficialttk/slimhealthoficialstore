

## Plano: Adicionar Opções de Frete na Página de Endereço

### Resumo
Vou adicionar uma seção de escolha de frete abaixo do formulário de endereço, com 3 opções conforme a referência. O valor do frete selecionado será somado ao subtotal do produto.

---

### Estrutura Visual (Conforme Referência)

```text
┌─────────────────────────────────────────────────────────┐
│ 🚚 Escolha uma forma de entrega:                        │
├─────────────────────────────────────────────────────────┤
│ ○ [FULL logo]  Frete Grátis                      Grátis │
│                Entrega em 10 a 12 dias           (verde)│
├─────────────────────────────────────────────────────────┤
│ ○ [Jadlog]     JADLOG                           R$15,90 │
│                Entrega em até 5 dias úteis              │
├─────────────────────────────────────────────────────────┤
│ ○ [Correios]   SEDEX 12                         R$29,90 │
│                Entrega de 12h a 24h                     │
└─────────────────────────────────────────────────────────┘
```

---

### Arquivos a Modificar/Criar

1. **Copiar logos para o projeto:**
   - `src/assets/frete/full-logo.png`
   - `src/assets/frete/jadlog-logo.png`
   - `src/assets/frete/correios-logo.png`

2. **Modificar:** `src/pages/EnderecoPage.tsx`
   - Adicionar estado para frete selecionado
   - Adicionar seção de opções de frete
   - Atualizar cálculo do total (subtotal + frete)
   - Salvar frete no localStorage para próxima etapa

---

### Detalhes Técnicos

**Novo estado para frete:**
```tsx
const [freteSelecionado, setFreteSelecionado] = useState<string | null>(null);

const opcoesFrete = [
  { id: 'full', nome: 'Frete Grátis', prazo: 'Entrega em 10 a 12 dias', valor: 0 },
  { id: 'jadlog', nome: 'JADLOG', prazo: 'Entrega em até 5 dias úteis', valor: 15.90 },
  { id: 'sedex', nome: 'SEDEX 12', prazo: 'Entrega de 12h a 24h', valor: 29.90 }
];
```

**Cálculo do total:**
```tsx
const freteAtual = opcoesFrete.find(f => f.id === freteSelecionado);
const valorFrete = freteAtual?.valor || 0;
const total = subtotal + valorFrete;
```

**Nova seção de frete (após o formulário de endereço):**
```tsx
<section className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
  {/* Header */}
  <div className="flex items-center gap-2 text-slate-700 text-sm mb-3">
    <Truck className="w-4 h-4" />
    <span>Escolha uma forma de entrega:</span>
  </div>

  {/* Opções de frete */}
  <div className="space-y-2">
    {opcoesFrete.map((opcao) => (
      <div
        key={opcao.id}
        onClick={() => setFreteSelecionado(opcao.id)}
        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
          freteSelecionado === opcao.id
            ? 'border-rose-500 bg-rose-50'
            : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        {/* Radio button */}
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          freteSelecionado === opcao.id
            ? 'border-rose-500'
            : 'border-slate-300'
        }`}>
          {freteSelecionado === opcao.id && (
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          )}
        </div>

        {/* Logo */}
        <img src={logoMap[opcao.id]} alt={opcao.nome} className="h-6 w-auto object-contain" />

        {/* Info */}
        <div className="flex-1">
          <div className="font-medium text-slate-900 text-sm">{opcao.nome}</div>
          <div className="text-xs text-slate-500">{opcao.prazo}</div>
        </div>

        {/* Preço */}
        <div className={`font-semibold text-sm ${
          opcao.valor === 0 ? 'text-emerald-600' : 'text-slate-900'
        }`}>
          {opcao.valor === 0 ? 'Grátis' : `R$ ${formatPrice(opcao.valor)}`}
        </div>
      </div>
    ))}
  </div>
</section>
```

**Validação atualizada (incluir frete obrigatório):**
```tsx
const isFormValid = 
  cep.length === 9 && 
  rua.trim() !== "" && 
  numero.trim() !== "" && 
  bairro.trim() !== "" && 
  cidade.trim() !== "" && 
  uf.length === 2 &&
  freteSelecionado !== null; // Frete obrigatório
```

**Footer atualizado (mostrar total com frete):**
```tsx
<div className="flex flex-col">
  <span className="text-sm text-slate-500">Total</span>
  <span className="text-xl font-bold text-rose-500">R$ {formatPrice(total)}</span>
</div>
```

**Salvar frete no localStorage:**
```tsx
const handleContinuar = () => {
  if (isFormValid) {
    localStorage.setItem('endereco', JSON.stringify({
      cep, rua, numero, complemento, bairro, cidade, uf
    }));
    localStorage.setItem('frete', JSON.stringify({
      tipo: freteSelecionado,
      nome: freteAtual?.nome,
      prazo: freteAtual?.prazo,
      valor: valorFrete
    }));
    navigate("/pagamento");
  }
};
```

---

### Arquivos Modificados
- Copiar 3 logos para `src/assets/frete/`
- `src/pages/EnderecoPage.tsx` - Adicionar seção de frete e cálculo do total

---

### Fluxo de Dados

```text
Produto (R$ 67,90 × quantidade)
    +
Frete (R$ 0,00 / R$ 15,90 / R$ 29,90)
    =
Total (exibido no footer e salvo para pagamento)
```

---

### Resultado Esperado
- 3 opções de frete com logos corretas
- Radio buttons funcionais para seleção
- Preço "Grátis" em verde, outros em preto
- Total atualizado dinamicamente (produto + frete)
- Dados salvos no localStorage para próxima etapa
- Botão "Continuar" só ativa quando frete for selecionado

