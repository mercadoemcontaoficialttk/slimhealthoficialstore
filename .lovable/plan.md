

## Plano: Corrigir Erro de Variáveis de Ambiente do Supabase

### Problema Identificado

O erro "VITE_SUPABASE_URL not configured" ocorre porque o código atual tenta usar variáveis de ambiente (`import.meta.env.VITE_SUPABASE_URL`) que não estão configuradas no Lovable Cloud.

### Solução

Vou atualizar os arquivos para usar a URL do Supabase Cloud diretamente, já que este projeto está conectado ao Lovable Cloud com URL fixa.

---

### Arquivos a Modificar

**1. `src/integrations/supabase/client.ts`**

Atualizar o cliente Supabase para usar as credenciais do Lovable Cloud diretamente:

```typescript
import { createClient } from '@supabase/supabase-js';

// Lovable Cloud Supabase Configuration
const SUPABASE_URL = "https://bnqilgvlvxfhpfasqhtk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Chave pública

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export para uso no hook
export { SUPABASE_URL, SUPABASE_ANON_KEY };
```

---

**2. `src/hooks/useParadisePix.ts`**

Atualizar o hook para importar a URL do cliente Supabase ao invés de usar variáveis de ambiente:

```typescript
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/integrations/supabase/client';

const getEdgeFunctionUrl = () => {
  return `${SUPABASE_URL}/functions/v1/paradise-pix`;
};
```

---

### Detalhes Técnicos

| Item | Antes | Depois |
|------|-------|--------|
| URL Supabase | `import.meta.env.VITE_SUPABASE_URL` | URL fixa exportada do client |
| Anon Key | `import.meta.env.VITE_SUPABASE_ANON_KEY` | Chave fixa exportada do client |
| Erro | "VITE_SUPABASE_URL not configured" | Funciona corretamente |

---

### Resultado Esperado

Após esta correção:
- O QR Code PIX será gerado corretamente em todas as páginas
- A chave PIX copia e cola funcionará
- O fluxo de todos os upsells funcionará perfeitamente
- O polling de status funcionará

---

### Segurança

A chave anônima (ANON_KEY) é segura para expor no frontend porque:
- É uma chave pública por design
- Usada apenas para chamar Edge Functions
- As Edge Functions usam a `PARADISE_API_KEY` secreta internamente

