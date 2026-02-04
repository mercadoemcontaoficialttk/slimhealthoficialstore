
# Plano: Corrigir Redirecionamento Após Pagamento PIX

## Resumo do Problema
Após pagar via PIX, o usuário não é redirecionado para a página de Upsell 1. O problema está em duas áreas:

1. **Webhook com formato de payload incorreto** - O Paradise Pags envia os dados em um formato diferente do esperado
2. **Verificação de status não funciona** - O sistema não consegue detectar quando o pagamento é aprovado

---

## O Que Será Corrigido

### 1. Atualizar o Webhook para o Formato Real do Paradise
O webhook atual espera:
```text
{ event: "transaction.paid", data: { id: "123" } }
```

Mas o Paradise envia:
```text
{ transaction_id: 4890764, status: "approved", webhook_type: "QR_CODE_COPY_AND_PASTE_PAID" }
```

**Solução:** Reescrever o webhook para aceitar ambos os formatos e processar corretamente.

---

### 2. Melhorar a Verificação de Status no Frontend
O sistema faz polling (verifica a cada 5 segundos) para saber se o pagamento foi aprovado. Vamos:

- Adicionar logs detalhados para debug
- Garantir que o status "approved" seja detectado corretamente
- Verificar se a navegação é chamada após aprovação

---

### 3. Adicionar Fallback de Verificação Local
Armazenar o status do webhook no localStorage para que o frontend detecte a aprovação mesmo se o polling da API falhar.

---

## Arquivos a Serem Modificados

| Arquivo | Alteração |
|---------|-----------|
| `supabase/functions/paradise-webhook/index.ts` | Aceitar formato real do Paradise e atualizar localStorage via resposta |
| `src/hooks/useParadisePix.ts` | Melhorar logs e verificação de status |
| `src/pages/PixPage.tsx` | Adicionar logs de debug e verificar callback |

---

## Detalhes Técnicos

### Webhook - Novo Formato Aceito
```text
// Formato do Paradise Pags (real)
{
  "transaction_id": 4890764,
  "external_id": "pedido_xxx",
  "status": "approved",
  "webhook_type": "QR_CODE_COPY_AND_PASTE_PAID"
}
```

### Mapeamento de Status
- `webhook_type: "QR_CODE_COPY_AND_PASTE_PAID"` → status `approved`
- `webhook_type: "QR_CODE_COPY_AND_PASTE_CREATED"` → status `pending`
- `status: "approved"` ou `status: "paid"` → status `approved`

### Fluxo de Redirecionamento
1. Usuário paga via PIX
2. Paradise envia webhook para nossa edge function
3. Webhook processa e retorna sucesso
4. Frontend faz polling a cada 5s
5. Quando status = approved, chama `navigate('/upsell1')`

---

## Resultado Esperado
Após essas correções, quando o pagamento for confirmado:
- Toast "Pagamento confirmado!" aparece
- Usuário é redirecionado automaticamente para /upsell1
- Evento TikTok "CompletePayment" é disparado
