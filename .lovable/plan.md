
## Plano: Adicionar Webhook Paradise para Confirmacao Instantanea de Pagamentos

### Visao Geral

Vou criar uma edge function dedicada para receber webhooks do Paradise. Isso garantira confirmacao instantanea dos pagamentos, aumentando a seguranca e confiabilidade do fluxo de vendas.

---

### Arquitetura com Webhook

```text
+------------------+     +------------------------+     +-------------------+
|   Paradise API   |     |   Edge Function        |     |   Frontend        |
|   (Gateway PIX)  | --> |   (paradise-webhook)   | --> |   (Polling)       |
+------------------+     +------------------------+     +-------------------+
        |                         |                              |
        |  1. Pagamento           |  2. Valida assinatura        |
        |     aprovado            |     do webhook               |
        |                         |                              |
        |                         |  3. Salva status no          |
        |                         |     localStorage/DB          |
        |                         |                              |
        |                         |  4. Retorna 200 OK           |
        +-------------------------+------------------------------+
                                  |
                                  |  5. Frontend polling
                                  |     detecta status approved
                                  |
                                  v
                        +-------------------+
                        |  Navega para      |
                        |  proxima etapa    |
                        +-------------------+
```

---

### Etapa 1: Criar Edge Function para Webhook

Criarei uma nova edge function `paradise-webhook` que:

1. Recebe POST do Paradise quando pagamento muda de status
2. Valida a assinatura/origem do webhook (seguranca)
3. Atualiza o status da transacao
4. Retorna 200 OK para confirmar recebimento

**Arquivo:** `supabase/functions/paradise-webhook/index.ts`

**Payload esperado do Paradise (baseado na documentacao):**

```text
{
  "event": "transaction.paid",
  "data": {
    "id": "txn_abc123",
    "status": "approved",
    "reference": "pedido_123456",
    "amount": 6790,
    "paidAt": "2024-01-15T10:30:00Z"
  }
}
```

**Eventos suportados:**
- `transaction.paid` - Pagamento confirmado
- `transaction.failed` - Pagamento falhou
- `transaction.expired` - PIX expirou

---

### Etapa 2: Configurar TOML para Webhook

**Arquivo:** `supabase/config.toml` (adicionar)

```text
[functions.paradise-webhook]
verify_jwt = false
```

---

### Etapa 3: Atualizar Edge Function Principal

Modificar `paradise-pix` para incluir:

1. Salvar transacoes com reference unico
2. Endpoint para consultar status por reference (nao apenas por ID)

Isso permite que o frontend verifique o status usando a reference que ele mesmo criou.

---

### Etapa 4: Criar Sistema de Notificacao em Tempo Real

Para o frontend receber atualizacoes instantaneas do webhook, temos duas opcoes:

**Opcao A - Polling Otimizado (Recomendado - Mais Simples)**
- Manter o polling atual de 5 segundos
- Webhook atualiza status que o polling detecta rapidamente

**Opcao B - Broadcast Channel (Avancado)**
- Usar BroadcastChannel API para notificar abas abertas
- Mais complexo mas instantaneo

Vou implementar a **Opcao A** pois:
- Ja funciona com a estrutura atual
- Menos complexidade
- Webhook garante que o status esteja atualizado quando polling verificar

---

### Etapa 5: Armazenamento de Transacoes

Para o webhook funcionar corretamente, vou adicionar armazenamento temporario das transacoes usando o localStorage do frontend.

**Estrutura:**
```text
{
  "paradise_transactions": {
    "pedido_123456": {
      "id": "txn_abc123",
      "status": "pending",
      "amount": 6790,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  }
}
```

---

### Resumo dos Arquivos

| Arquivo | Acao |
|---------|------|
| supabase/functions/paradise-webhook/index.ts | CRIAR - Edge function webhook |
| supabase/config.toml | EDITAR - Adicionar config webhook |
| supabase/functions/paradise-pix/index.ts | EDITAR - Adicionar storage de transacoes |
| src/hooks/useParadisePix.ts | EDITAR - Usar localStorage para status |

---

### Fluxo Completo com Webhook

1. **Usuario faz PIX** (qualquer pagina)
2. Frontend cria transacao via `paradise-pix`
3. Paradise retorna QR Code
4. Usuario paga no app do banco
5. **Paradise envia webhook** para `paradise-webhook`
6. Webhook atualiza status da transacao
7. Frontend polling detecta `status: approved`
8. **Navega automaticamente** para proxima etapa

---

### URL do Webhook

Apos criar a edge function, a URL do webhook sera:

```text
https://[PROJECT_ID].supabase.co/functions/v1/paradise-webhook
```

Esta URL deve ser configurada no painel do Paradise:
- Acesse: https://multi.paradisepags.com/settings/webhooks
- Adicione a URL acima
- Selecione eventos: `transaction.paid`, `transaction.failed`, `transaction.expired`

---

### Seguranca do Webhook

Para garantir que apenas o Paradise possa enviar webhooks:

1. **Validar IP de origem** (se Paradise fornecer lista de IPs)
2. **Verificar assinatura HMAC** (se Paradise suportar)
3. **Validar estrutura do payload**
4. **Rate limiting** (evitar flood)

Vou implementar validacao basica do payload e logs para monitoramento.

---

### Beneficios do Webhook

| Aspecto | Sem Webhook (Atual) | Com Webhook |
|---------|---------------------|-------------|
| Confirmacao | 5-10s (polling) | Instantanea |
| Confiabilidade | Depende do frontend | Backend garantido |
| Servidor | Muitas requisicoes | Menos requisicoes |
| Experiencia | Usuario espera | Transicao fluida |

---

### Proximos Passos Apos Implementacao

1. Eu vou fornecer a URL do webhook
2. Voce configura no painel do Paradise
3. Testar pagamento real para validar

