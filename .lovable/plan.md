

## Trocar chave API da Paradise Pags

### Situacao atual
- A chave `PARADISE_API_KEY` esta armazenada como segredo no backend (Lovable Cloud)
- Ela e acessada apenas pela Edge Function `paradise-pix` via `Deno.env.get('PARADISE_API_KEY')`
- **Nenhum arquivo do frontend** contem a chave -- ela nao aparece em nenhum `.tsx`, upsell ou pagina

### O que sera feito
1. Atualizar o segredo `PARADISE_API_KEY` no backend com o novo valor:
   `sk_920f90a287d09114180f38a093abf8c00f6f1fd257c4f180161734e1e2f408e2`

### O que NAO precisa ser feito
- Nenhuma alteracao em arquivos do frontend
- Nenhuma alteracao nas Edge Functions (o codigo ja le o segredo dinamicamente)
- Nenhuma alteracao nos upsells ou paginas de checkout

### Detalhes tecnicos
- A Edge Function `supabase/functions/paradise-pix/index.ts` usa `Deno.env.get('PARADISE_API_KEY')` na linha 68
- Ao atualizar o segredo, todas as proximas chamadas da funcao usarao automaticamente a nova chave
- A funcao sera re-deployada para garantir que o novo valor seja carregado

