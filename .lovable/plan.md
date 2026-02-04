

## Plano: Criar Página de Endereço

### Resumo
Vou criar a página `/endereco` que aparece após o lead preencher os dados pessoais. A página seguirá exatamente o mesmo design da página de Dados Pessoais, com integração à API ViaCEP para preenchimento automático do endereço.

---

### Estrutura da Página (Conforme Referência)

#### Header
- Botão de voltar (seta para esquerda)
- Título "Endereço"
- Barra de progresso rosa em 75% (3/4 do checkout)

#### Card do Produto
- Mesmo card da página anterior
- Imagem do Mounjaro
- Preço dinâmico (soma conforme quantidade)
- Controle de quantidade (+/-)
- Texto "29 comprando agora" em verde

#### Formulário de Endereço
- Ícone de cadeado + "Dados protegidos"
- **CEP** - Campo com máscara (00000-000), ao preencher busca endereço automaticamente
- **Rua** - Preenchido automaticamente pela API
- **Número** + **Complemento** - Lado a lado
- **Bairro** - Preenchido automaticamente
- **Cidade** + **UF** - Lado a lado (cidade maior, UF menor)

#### Footer Fixo
- Subtotal à esquerda (valor em rosa)
- Botão "Continuar" à direita (rosa quando válido, cinza quando inválido)

#### Badges de Segurança
- Mesmos badges da página anterior (Compra Segura, SSL Ativo, Garantia)

---

### Arquivos a Criar/Modificar

1. **Criar:** `src/pages/EnderecoPage.tsx`
   - Nova página com formulário de endereço
   - Integração com API ViaCEP

2. **Modificar:** `src/App.tsx`
   - Adicionar rota `/endereco`

---

### Detalhes Técnicos

**API ViaCEP (Gratuita):**
```typescript
const buscarEndereco = async (cep: string) => {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length === 8) {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();
    if (!data.erro) {
      setRua(data.logradouro);
      setBairro(data.bairro);
      setCidade(data.localidade);
      setUf(data.uf);
    }
  }
};
```

**Estado do componente:**
```typescript
// Recuperar dados da página anterior
const dadosPessoais = JSON.parse(localStorage.getItem('dadosPessoais') || '{}');
const [quantidade, setQuantidade] = useState(dadosPessoais.quantidade || 1);

// Campos de endereço
const [cep, setCep] = useState("");
const [rua, setRua] = useState("");
const [numero, setNumero] = useState("");
const [complemento, setComplemento] = useState("");
const [bairro, setBairro] = useState("");
const [cidade, setCidade] = useState("");
const [uf, setUf] = useState("");
```

**Máscara de CEP:**
```typescript
const handleCepChange = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  let formatted = digits;
  if (digits.length > 5) {
    formatted = digits.slice(0, 5) + '-' + digits.slice(5);
  }
  setCep(formatted);
  // Buscar endereço quando CEP completo
  if (digits.length === 8) {
    buscarEndereco(digits);
  }
};
```

**Validação do formulário:**
- CEP: 9 caracteres (com hífen)
- Rua: não vazio
- Número: não vazio
- Bairro: não vazio
- Cidade: não vazio
- UF: 2 caracteres

**Layout dos campos lado a lado:**
```tsx
{/* Número e Complemento */}
<div className="grid grid-cols-2 gap-3">
  <div>
    <label>Número</label>
    <Input placeholder="Nº" ... />
  </div>
  <div>
    <label>Complemento</label>
    <Input placeholder="Opcional" ... />
  </div>
</div>

{/* Cidade e UF */}
<div className="grid grid-cols-[1fr_80px] gap-3">
  <div>
    <label>Cidade</label>
    <Input placeholder="Cidade" ... />
  </div>
  <div>
    <label>UF</label>
    <Input placeholder="UF" ... />
  </div>
</div>
```

**Barra de progresso:**
```tsx
<div className="h-1 bg-slate-200">
  <div className="h-full w-3/4 bg-rose-500" />
</div>
```

---

### Fluxo de Dados

```text
Dados Pessoais (/dados-pessoais)
    ↓ [Salva nome, email, telefone, cpf, quantidade no localStorage]
Endereço (/endereco)
    ↓ [Recupera quantidade, salva endereço]
Pagamento (/pagamento) - próxima etapa
```

---

### Resultado Esperado
- Página de endereço 100% igual à referência
- Preenchimento automático do endereço ao digitar CEP (ViaCEP)
- Quantidade e subtotal sincronizados com a página anterior
- Mesmos estilos (inputs, botões, badges) da página de Dados Pessoais
- Barra de progresso em 75%

