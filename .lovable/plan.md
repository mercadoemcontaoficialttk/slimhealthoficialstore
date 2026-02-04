
## Diagnóstico (o que está acontecendo de verdade)

- O erro exibido no front é **`TypeError: Failed to fetch`** ao chamar:
  `https://bnqilgvlvxfhpfasqhtk.supabase.co/functions/v1/paradise-pix`
- Esse tipo de erro **não é “erro do Paradise” nem “erro 400/500”**; é **falha de rede no navegador**, quase sempre causada por:
  1) **CORS / preflight bloqueado** (o navegador barra antes de entregar a resposta ao JS), ou  
  2) endpoint não acessível / função não respondendo corretamente ao preflight.

Pelos headers enviados (Authorization + apikey + content-type) e pelo fato de acontecer **sempre** no preview, o caminho mais confiável é **parar de chamar a Edge Function via `fetch` “na unha”** e passar a chamar via **`supabase.functions.invoke()`**, que é o fluxo “oficial” e já injeta headers/assinaturas esperadas pela gateway do Supabase.

Além disso, hoje o `paradise-pix` trabalha com **POST (criar)** e **GET (status via querystring)**. Para usar `invoke()` de forma consistente, vamos padronizar para **POST com `action` no body** (mantendo compatibilidade com o GET atual para não quebrar nada).

Observação importante (para não te vender falsa segurança): **Webhook não consegue atualizar `localStorage` do navegador**. Então, mesmo depois que o fetch funcionar, o “status aprovado via webhook” precisa ser persistido em algum lugar do backend (DB) ou então o polling continuará sendo o mecanismo real. Eu vou manter o polling funcionando e preparar o backend para receber status do webhook de forma correta (via DB) numa etapa seguinte, se você aprovar.

---

## Objetivo imediato

1) Fazer **/pix** e **todos os upsells** gerarem **QR Code + Copia e Cola** sem erro (parar o “Failed to fetch”).  
2) Garantir que o **status check** também funcione (para avançar o funil quando pagar).

---

## Mudanças que vou implementar

### 1) Frontend: trocar `fetch()` por `supabase.functions.invoke()`
Arquivo: `src/hooks/useParadisePix.ts`

- Substituir:
  - `fetch(`${SUPABASE_URL}/functions/v1/paradise-pix`, ...)`
- Por:
  - `supabase.functions.invoke('paradise-pix', { body: {...} })`

Isso reduz drasticamente risco de CORS/preflight falhar por headers “não esperados” no preview do Lovable.

Também vou:
- Unificar a chamada de **status** via `invoke` com `action: 'status'` no body
- Melhorar o tratamento de erro para mostrar mensagem mais clara (ex.: “não foi possível conectar à função de pagamento” vs só “Failed to fetch”).

### 2) Edge Function `paradise-pix`: aceitar POST com `action`
Arquivo: `supabase/functions/paradise-pix/index.ts`

Vou ajustar o handler para suportar:

- **POST** com body:
  - `{ action: 'create', amount, description, reference, customer }`
  - `{ action: 'status', id?: string, reference?: string }`

E manter o que já existe para compatibilidade:
- `GET ?action=status&id=...` (continua funcionando, mas o front vai parar de depender disso)

Além disso, vou adicionar um endpoint simples de diagnóstico:
- `GET ?action=health` retornando `200` + JSON `{ ok: true }` + CORS  
Isso permite validar rapidamente se a função está “de pé” sem depender do Paradise.

### 3) (Opcional, mas recomendado) CORS mais robusto: refletir a Origin
Arquivo: `supabase/functions/paradise-pix/index.ts` (e, se necessário, `paradise-webhook`)

Em vez de sempre `Access-Control-Allow-Origin: *`, vou:
- Ler `req.headers.get('origin')`
- Retornar `Access-Control-Allow-Origin` com a origem recebida (quando existir)
Isso costuma resolver casos onde alguma camada intermediária fica mais “restritiva” com `Authorization` + `*`.

### 4) Conferência do segredo no runtime (sem expor nada)
Sem pedir sua chave de novo:
- Vou garantir que, se `PARADISE_API_KEY` estiver ausente, o erro retornado seja claro e **em JSON** com CORS.
(Esse não é o seu erro atual, mas é um “guardrail” importante.)

---

## Como vamos validar (teste end-to-end)

Depois das mudanças:

1) Abrir `/pix` com `pedido` e `dadosPessoais` preenchidos (fluxo normal do funil)
2) Verificar que:
   - Aparece “Gerando QR Code…”
   - Em seguida carrega **QR Code** e habilita **Copiar código PIX**
3) Clicar em “Copiar código PIX” e confirmar o toast de sucesso
4) Repetir rapidamente em **/upsell1** (abrir modal e gerar PIX)
5) Se possível, fazer 1 pagamento real pequeno e confirmar que o polling avança de página.

---

## Arquivos impactados

- `src/hooks/useParadisePix.ts` (trocar fetch por invoke; status via action)
- `src/integrations/supabase/client.ts` (apenas garantir que `supabase` é importável onde precisar — já está ok)
- `supabase/functions/paradise-pix/index.ts` (POST action + health + CORS robusto)
- (se necessário) `supabase/functions/paradise-webhook/index.ts` (apenas CORS/reflexo de origin, se a mesma restrição aparecer)

---

## Resultado esperado

- O erro “Failed to fetch” para de ocorrer no preview
- QR Code e chave copia e cola passam a ser gerados em **/pix** e **todos os upsells**
- Status check volta a funcionar (polling), permitindo o funil avançar quando aprovado

