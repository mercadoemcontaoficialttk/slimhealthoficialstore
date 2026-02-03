

## Plano: Remover Passo da Roleta do Funil

### Visao Geral

Remover o passo 4 (roleta de premios) do funil de pre-venda, mantendo apenas os 3 primeiros passos. O componente PrizeWheel sera mantido no projeto para uso futuro, apenas removendo sua integracao no fluxo atual.

---

### Mudancas em `src/pages/Index.tsx`

#### 1. Remover Import do PrizeWheel

```text
Antes (linha 8):
import PrizeWheel from "@/components/PrizeWheel";

Depois:
// PrizeWheel removido do fluxo - disponivel em @/components/PrizeWheel
```

#### 2. Ajustar Funcao handleContinue

O passo 3 agora redireciona diretamente para o checkout em vez de ir para a roleta.

```text
Antes:
} else if (step === 3 && age.trim()) {
  setStep(4); // Go to prize wheel
}

Depois:
} else if (step === 3 && age.trim()) {
  navigate("/checkout"); // Ir direto para checkout
}
```

#### 3. Remover Funcao handleWheelWin

Esta funcao nao sera mais necessaria pois nao ha mais roleta.

```text
Antes:
const handleWheelWin = () => {
  navigate("/checkout");
};

Depois:
(remover)
```

#### 4. Remover Renderizacao do Step 4

```text
Antes (linhas 121-123):
{step === 4 && (
  <PrizeWheel onWin={handleWheelWin} userName={name} />
)}

Depois:
(remover)
```

#### 5. Simplificar Condicao do Botao

O botao sempre aparece nos 3 passos.

```text
Antes (linha 126):
{step < 4 && (

Depois:
{step <= 3 && (
```

(Esta mudanca e apenas para clareza, funcionalmente igual)

---

### Componente PrizeWheel Mantido

O arquivo `src/components/PrizeWheel.tsx` permanece intacto e disponivel para uso futuro. Voce pode reativar a roleta a qualquer momento importando-a novamente no Index.tsx.

---

### Fluxo Atualizado

| Passo | Conteudo | Acao do Botao |
|-------|----------|---------------|
| 1 | Landing page com logos e alerta | Ir para passo 2 |
| 2 | Captura de nome | Ir para passo 3 |
| 3 | Confirmacao de idade | Ir para /checkout |

---

### Arquivo a Modificar

| Arquivo | Acao |
|---------|------|
| src/pages/Index.tsx | Remover integracao da roleta, redirecionar passo 3 para checkout |
| src/components/PrizeWheel.tsx | Nenhuma mudanca - manter para uso futuro |

