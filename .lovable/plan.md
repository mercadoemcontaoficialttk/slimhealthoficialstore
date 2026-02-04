
## Plano: Criar Página de Dados Pessoais

### Resumo
Vou criar a página `/dados-pessoais` que será exibida quando o lead clicar em "Comprar Agora" na página do Mounjaro. A página seguirá o design da referência enviada.

---

### Estrutura da Página

#### Header
- Botão de voltar (seta para esquerda)
- Título "Dados pessoais"
- Barra de progresso vermelha/verde (metade preenchida)

#### Card do Produto
- Imagem do produto Mounjaro (foto1.png)
- Nome: "Mounjaro 5 mg – Tirzepatida (caneta..."
- Preço: R$ 67,90 (verde)
- Controle de quantidade (+/- e número)
- Texto de urgência: "27 comprando agora" (verde)

#### Formulário de Dados
- Ícone de cadeado + "Dados protegidos"
- Campo: Nome completo (placeholder: "Digite seu nome")
- Campo: E-mail (placeholder: "seu@email.com")
- Campo: Telefone com máscara (placeholder: "(00) 00000-0000")
- Campo: CPF com máscara (placeholder: "000.000.000-00")

#### Footer Fixo
- Subtotal: "R$ 67,90" (vermelho)
- Botão "Continuar" (desabilitado até preencher campos)

---

### Arquivos a Criar/Modificar

1. **Criar:** `src/pages/DadosPessoaisPage.tsx`
   - Nova página completa seguindo o design

2. **Modificar:** `src/App.tsx`
   - Adicionar rota `/dados-pessoais`

3. **Modificar:** `src/pages/MounjaroPage.tsx`
   - Alterar navegação do botão "Comprar Agora" de `/checkout` para `/dados-pessoais`

---

### Detalhes Técnicos

**Componentes e imports:**
```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Minus, Plus, Lock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import foto1 from "@/assets/mounjaro/foto1.png";
```

**Máscaras de input:**
- Telefone: (XX) XXXXX-XXXX
- CPF: XXX.XXX.XXX-XX

**Validação:**
- Botão "Continuar" só ativa quando todos os campos estiverem preenchidos
- Validação básica de email e CPF

**Estado do componente:**
```tsx
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [telefone, setTelefone] = useState("");
const [cpf, setCpf] = useState("");
const [quantidade, setQuantidade] = useState(1);
```

**Cálculo do subtotal:**
- Preço base: R$ 67,90
- Subtotal = preço * quantidade

---

### Fluxo do Funil Atualizado

```text
Página Inicial (/)
    ↓
Step 1: Oferta
    ↓
Step 2: Nome
    ↓
Step 3: Idade
    ↓
Mounjaro (/mounjaro)
    ↓ [Comprar Agora]
Dados Pessoais (/dados-pessoais)
    ↓ [Continuar]
(Próxima etapa - Endereço ou Pagamento)
```

---

### Resultado Esperado
- Página de dados pessoais idêntica à referência
- Navegação fluida do produto para dados pessoais
- Controle de quantidade funcional
- Formulário com máscaras de telefone e CPF
- Footer fixo com subtotal dinâmico
