
## Objetivo (urgente)
Garantir que o lead seja redirecionado automaticamente em todas as etapas do funil assim que cada pagamento for aprovado:

- PIX (checkout) aprovado → `/upsell1`
- Upsell 1 aprovado → `/upsell2`
- Upsell 2 aprovado → `/upsell3`
- Upsell 3 aprovado → `/upsell4`
- Upsell 4 aprovado → `/rastreio`

## Diagnóstico (por que está falhando mesmo com webhook chegando)
O problema mais provável não é o webhook nem o gateway em si (os logs mostram transação “approved”), e sim um bug de “estado desatualizado” no front:

- `createPixPayment()` faz `setTransactionId(...)` e `setCurrentReference(...)` (estado React).
- Logo em seguida, o código chama `startPolling(...)`.
- Porém, nesse momento, **o React ainda não re-renderizou** com o novo `transactionId/reference`.
- Resultado: o `startPolling()` que foi chamado está “preso” (closure) com um `checkPaymentStatus()` que ainda enxerga `transactionId = null` / `reference = null`, então:
  - o polling roda, mas consulta “sem ID”
  - nunca detecta “approved”
  - nunca chama o callback que faz `navigate(...)`

Esse padrão existe no checkout (`/pix`) e também em todos os upsells (1 a 4), então o funil inteiro fica instável.

## Estratégia de correção (robusta e única para todas as páginas)
Consertar a lógica no **hook `useParadisePix`** para que o polling sempre use os valores “mais recentes” do `transactionId` e `reference`, mesmo antes do re-render.

### Solução principal (corrige o funil inteiro)
1. **Adicionar refs internas no hook**:
   - `transactionIdRef`
   - `currentReferenceRef`

2. **No `createPixPayment`**, quando receber `txId` e `txReference`:
   - atualizar `transactionIdRef.current = txId` e `currentReferenceRef.current = txReference` **imediatamente** (sincrono)
   - depois manter os `setTransactionId(...)` e `setCurrentReference(...)` como hoje para UI/estado

3. **No `checkPaymentStatus`**, ao invés de confiar no state (que pode estar atrasado), ler primeiro:
   - `const txId = transactionIdRef.current || transactionId`
   - `const ref = currentReferenceRef.current || currentReference`
   Assim, mesmo que o re-render ainda não tenha acontecido, o status check funciona.

4. **No `startPolling`**, garantir que ele chame `checkPaymentStatus()` que lê das refs (ou usar uma ref para a função), para nunca ficar preso ao estado antigo.

5. **No `reset`**, limpar também as refs (senão podem “vazar” para uma tentativa nova).

### Reforço (opcional, mas recomendado para “blindar” redirect)
Adicionar em cada página (PixPage + Upsell1-4) um fallback simples:
- um `useEffect` que observa `paymentStatus`
- se ficar `approved`, faz o `navigate(...)` correspondente
Isso garante que mesmo se o callback de polling falhar por qualquer motivo, o redirect acontece.

## Arquivos envolvidos
- `src/hooks/useParadisePix.ts` (correção central e definitiva)
- (Opcional reforço)  
  - `src/pages/PixPage.tsx`  
  - `src/pages/Upsell1Page.tsx`  
  - `src/pages/Upsell2Page.tsx`  
  - `src/pages/Upsell3Page.tsx`  
  - `src/pages/Upsell4Page.tsx`

## Teste de validação (obrigatório)
1. Abrir o fluxo normal até `/pix` e gerar um pagamento.
2. Pagar e **não recarregar a página**.
3. Confirmar no console que o polling está consultando com `Transaction ID` preenchido (não null).
4. Assim que o status virar `approved`, validar:
   - toast de sucesso
   - redirect automático para `/upsell1`
5. Repetir o mesmo procedimento em cada upsell, confirmando a sequência até `/rastreio`.

## Observação importante sobre webhook vs front
Mesmo o webhook “chegando” no backend, ele não consegue atualizar diretamente o `localStorage` do navegador. Então o front precisa detectar o “approved” via polling (consulta) — e por isso essa correção de polling com refs é crítica para funcionar 100% do tempo.

## Resultado esperado
Após a correção no hook, qualquer etapa que chame:
- `createPixPayment(...)` → `startPolling(() => navigate(...))`
passa a redirecionar corretamente, sem depender do timing de re-render do React, e o funil inteiro volta a avançar automaticamente.
