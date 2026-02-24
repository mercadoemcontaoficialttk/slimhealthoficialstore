
Objetivo imediato: eliminar definitivamente a falha no `/upsell3` e garantir que o QR de pagamento seja gerado quando os dados forem válidos, com tratamento correto quando os dados estiverem inválidos.

Diagnóstico (com evidência real do projeto)
- A chamada frontend para o backend está funcionando.
- O backend está respondendo corretamente (HTTP 200 + JSON de erro estruturado).
- O bloqueio acontece no gateway externo com `paradise_status: 400`.
- No request capturado, os dados enviados foram:
  - `document: 99989878908` (CPF inválido pelos dígitos verificadores)
  - `name: "Adryan Gonçalves - 02"` (nome com sufixo numérico, potencialmente rejeitável)
- O próprio log da função mostra tentativa A/B/C e todas rejeitadas pelo adquirente.
- Também foi comprovado em log que, com CPF válido, o mesmo fluxo de upsell3 gera transação com sucesso.
- Conclusão: o problema principal não é “modal”, nem “rota”, nem “hook quebrado” neste momento; é consistência/qualidade de dados + UX de recuperação quando há dado inválido/stale no `localStorage`.

Escopo da correção (para ficar estável e previsível)
1) Validar e normalizar dados do pagador de forma centralizada no frontend.
2) Bloquear chamada de criação PIX quando os dados estiverem inválidos no upsell3.
3) Exibir erro acionável (não genérico) para o usuário corrigir dados.
4) Fortalecer validação server-side com mesma regra (dupla proteção).
5) Garantir renderização visual do QR mesmo quando o gateway não mandar `qr_code_base64` (apenas copia e cola).
6) Eliminar risco residual de inconsistência no hook (manter assinatura estável de hooks, sem ramificações de hook em runtime).

Arquivos a ajustar
- `src/pages/Upsell3Page.tsx`
- `src/hooks/useParadisePix.ts`
- `src/components/PixPaymentModal.tsx`
- `src/pages/DadosPessoaisPage.tsx`
- `supabase/functions/paradise-pix/index.ts`
- (novo util compartilhado) `src/lib/paymentCustomer.ts` para normalização/validação

Plano de implementação detalhado (ordem de execução)

1) Criar util único de validação/normalização de cliente (frontend)
- Implementar em `src/lib/paymentCustomer.ts`:
  - `sanitizeCustomerName(name)` (trim, remover ruído numérico no final, colapsar espaços).
  - `sanitizeDocument(cpf)` (somente dígitos).
  - `sanitizePhone(phone)` (somente dígitos).
  - `isValidCpf(cpfDigits)` com dígitos verificadores.
  - `validateCustomerForPix({name,email,document,phone})` retornando erros por campo.
- Benefício:
  - evita divergência de regra entre páginas;
  - reduz erro silencioso vindo de `localStorage` antigo.

2) Corrigir o fluxo do Upsell3 para não tentar pagamento com dado inválido
- Em `Upsell3Page.tsx`:
  - Ao carregar `dadosPessoais`, normalizar antes de usar.
  - Antes de abrir modal e criar pagamento, validar com util central.
  - Se inválido:
    - não chamar `createPixPaymentWithTracking`;
    - mostrar mensagem objetiva com motivo (CPF inválido / telefone inválido / nome inválido);
    - oferecer caminho de correção (redirigir para `/dados-pessoais` ou CTA “corrigir dados”).
  - Proteger contra clique duplo e retry concorrente quando `isLoading=true`.
- Resultado:
  - para dados válidos: segue direto e gera cobrança;
  - para dados inválidos: não “queima tentativa” no gateway e orienta correção.

3) Ajustar mensagens de erro no hook para serem diagnósticas
- Em `useParadisePix.ts`:
  - Melhorar `parseErrorMessage` para distinguir:
    - erro de validação local/backend (`validation_failed`);
    - rejeição de adquirente por dados (`details.message` contendo “verifique os dados informados”);
    - indisponibilidade temporária real.
  - Parar de tratar todo `paradise_status: 400` como “erro temporário”.
- Resultado:
  - usuário recebe ação correta (corrigir dados vs tentar depois);
  - suporte técnico fica mais simples.

4) Garantir exibição visual do QR mesmo sem base64
- Em `PixPaymentModal.tsx`:
  - Quando `qrCodeBase64` vier vazio, mas existir `qrCode` (copia e cola), gerar fallback visual para renderização do QR.
  - Manter botão de copiar sempre funcional.
- Resultado:
  - evita cenário “pagamento criado mas QR visual não aparece”.

5) Endurecer validação no backend (mesma regra crítica)
- Em `supabase/functions/paradise-pix/index.ts`:
  - Reusar lógica equivalente de CPF válido (dígitos verificadores), telefone e nome limpo.
  - Retornar `validation_failed: true` + mensagem específica por campo.
  - Manter fallback A/B/C para compatibilidade com o gateway.
- Resultado:
  - dupla camada de proteção;
  - não depende só do frontend.

6) Ajuste na origem dos dados (dados pessoais)
- Em `DadosPessoaisPage.tsx`:
  - já existe validação de CPF; complementar com validação mais forte de nome e e-mail.
  - salvar dados já normalizados para reduzir lixo no funil.
- Resultado:
  - evita propagação de dado ruim para upsells.

Risco e mitigação
- Risco: usuário testar direto `/upsell3` com `localStorage` antigo inválido.
  - Mitigação: validação no upsell3 + redirecionamento para correção.
- Risco: gateway aceitar/rejeitar por regras internas não documentadas.
  - Mitigação: mensagens específicas + logs estruturados por tentativa e motivo.
- Risco: QR visual ausente quando API não enviar base64.
  - Mitigação: fallback visual a partir do payload copia-e-cola.

Critérios de aceite
- `/upsell3` com dados válidos gera QR e permite pagamento.
- `/upsell3` com CPF inválido não chama gateway; mostra erro claro de correção.
- Erro no modal deixa de ser genérico “temporário” quando o problema é dado inválido.
- Quando houver `qrCode` sem `qrCodeBase64`, QR visual ainda aparece via fallback.
- Nenhum erro de hooks (“Rendered more hooks than during the previous render”) durante navegação normal e abertura/fechamento de modal.

Validação pós-implementação (obrigatória)
1) Teste end-to-end completo do funil: `/dados-pessoais` → `/endereco` → `/confirmacao` → `/pix` → `/upsell1` → `/upsell2` → `/upsell3`.
2) Em `/upsell3`, testar cenário com dados válidos e confirmar geração de QR.
3) Testar cenário com CPF inválido no storage e confirmar bloqueio + orientação para correção.
4) Validar no backend logs de tentativa e classificação de erro.
5) Repetir teste em mobile (viewport menor) para confirmar modal e QR renderizando corretamente.
