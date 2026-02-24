
Objetivo: eliminar o erro de geração de QR Code no `/upsell3` de forma definitiva, atacando a causa real (rejeição 400 do gateway no create), e não só a mensagem de erro.

Diagnóstico confirmado
- O frontend está chamando corretamente o backend.
- O backend está respondendo corretamente para o frontend (status 200 com erro estruturado).
- O erro real vem do gateway externo com `paradise_status: 400` durante `action=create` no upsell3.
- Evidência: logs mostram payload do upsell3 rejeitado, enquanto o `/pix` principal com outro payload é aceito (status 200 com `transaction_id`).
- Portanto, o problema não é “modal quebrado”, e sim robustez insuficiente na validação/sanitização/retry do payload antes de enviar ao gateway.

Escopo da correção
1) Fortalecer backend de pagamento para criar transação com fallback inteligente.
2) Fortalecer hook de pagamento no frontend para trabalhar com referência efetiva e mensagens úteis.
3) Ajustar fluxo do `/upsell3` para validar dados antes de abrir modal.
4) Prevenir recorrência na origem (dados pessoais), validando CPF/nome melhor.

Arquivos a alterar
- `supabase/functions/paradise-pix/index.ts`
- `src/hooks/useParadisePix.ts`
- `src/pages/Upsell3Page.tsx`
- `src/pages/DadosPessoaisPage.tsx`

Sequência de implementação

1. Backend: tornar criação PIX resiliente (primeira prioridade)
- Em `paradise-pix`, no bloco `action=create`:
  - Normalizar `customer` (document e phone só dígitos, trim de nome/email).
  - Validar campos mínimos antes de chamar gateway:
    - CPF/documento com 11 dígitos
    - telefone com 10 ou 11 dígitos
    - nome não vazio
    - email básico válido
  - Estratégia de tentativa:
    - Tentativa A: payload atual (com tracking).
    - Se falhar com 400 genérico: Tentativa B sem objeto `tracking`.
    - Se ainda falhar: retornar erro estruturado final com contexto técnico seguro (sem expor segredo).
- Resultado esperado:
  - reduzir falha por payload incompatível;
  - manter analytics quando possível;
  - ainda devolver erro legível quando for rejeição real de dados.

2. Hook de pagamento: consumir resposta de forma robusta
- Em `useParadisePix.ts` (`createPixPaymentWithTracking` e `createPixPayment`):
  - Usar `effectiveReference` retornada pelo backend (`data.id` quando disponível), em vez de sempre fixar a referência local inicial.
  - Salvar `currentReference` com valor efetivo para polling/storage consistente.
  - Melhorar tratamento de `data.error`:
    - mensagem amigável para usuário;
    - diferenciar “dados inválidos” de “instabilidade”.
- Resultado esperado:
  - evitar inconsistência de referência em fluxos com fallback;
  - melhorar clareza da falha para ação imediata.

3. Upsell3: corrigir UX de abertura do modal
- Em `Upsell3Page.tsx`:
  - Validar `dadosPessoais` antes de `setShowModal(true)`.
  - Se dados ausentes/inconsistentes, não abrir modal vazio; mostrar erro claro e orientar correção.
  - Manter `retry`, mas sem reabrir fluxo com estado inválido.
- Resultado esperado:
  - o modal só abre quando há chance real de gerar QR;
  - elimina comportamento confuso em tentativas inválidas.

4. Prevenção na origem: validação em Dados Pessoais
- Em `DadosPessoaisPage.tsx`:
  - Adicionar validação real de CPF (dígitos verificadores).
  - Reforçar validação de nome (evitar entrada inválida óbvia).
- Resultado esperado:
  - diminuir drasticamente rejeições no gateway ao longo de todo funil (pix + upsells).

Seção técnica (resumo de arquitetura após ajuste)

```text
Dados pessoais -> validação local forte
       |
       v
Upsell3 (pré-validação antes de abrir modal)
       |
       v
useParadisePix (referência efetiva + erro estruturado)
       |
       v
backend paradise-pix
  - valida/sanitiza
  - create tentativa A (com tracking)
  - fallback tentativa B (sem tracking) se 400
       |
       v
Gateway retorna transaction_id (sucesso) ou erro final legível
```

Critérios de aceite
- No `/upsell3`, com dados válidos, o QR Code deve ser gerado sem erro genérico.
- Em rejeição real, usuário vê mensagem clara de correção de dados (sem “erro misterioso”).
- Referência/ID usados no polling permanecem consistentes após fallback.
- Fluxo principal `/pix` continua funcional sem regressão.
- Upsells continuam usando o mesmo hook compartilhado sem quebrar redirecionamentos.

Validação pós-implementação (E2E)
1) Fluxo completo: `/dados-pessoais` -> `/endereco` -> `/confirmacao` -> `/pix` -> `/upsell1` -> `/upsell2` -> `/upsell3`.
2) Em `/upsell3`, clicar “PAGAR FRETE” e confirmar:
   - gera QR ou mostra erro de dados acionável.
3) Reteste com “Tentar novamente” para confirmar comportamento estável.
4) Conferir logs do backend:
   - tentativa A/B registradas corretamente;
   - sem erro inesperado de parsing/payload.
