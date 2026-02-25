
## Corrigir QR Codes em todas as paginas de pagamento

### Problema identificado

Existem dois problemas principais afetando os QR Codes:

1. **PixPage (/pix)**: O QR Code nunca aparece visualmente porque a API retorna `qr_code_base64: null`. O codigo atual so renderiza o QR se `qrCodeBase64` existir - caso contrario mostra um spinner eterno de "Carregando...". Precisa do mesmo fallback que o `PixPaymentModal` ja tem (gerar imagem via `api.qrserver.com`).

2. **Upsell1, Upsell2, Upsell4**: Enviam dados do cliente com mascaras (ex: `"083.593.873-54"`, `"(88) 99815-5378"`) diretamente ao backend sem sanitizar. O backend ja limpa isso, mas nao ha validacao preventiva - um CPF invalido so e detectado depois de chamar a API. Precisam usar `validateCustomerForPix` como o Upsell3 ja faz.

### Arquivos a alterar

**1. `src/pages/PixPage.tsx`** (Prioridade maxima)
- Corrigir renderizacao do QR Code: adicionar fallback para gerar imagem via URL quando `qrCodeBase64` for null mas `qrCode` existir
- Usar `validateCustomerForPix` para sanitizar dados antes de enviar ao backend
- Substituir o bloco do QR (linhas 248-265) para usar a mesma logica do PixPaymentModal

**2. `src/pages/Upsell1Page.tsx`**
- Importar e usar `validateCustomerForPix` no `handleOpenModal`
- Sanitizar dados antes de chamar `createPixPaymentWithTracking`
- Bloquear chamada se dados forem invalidos (CPF, telefone)

**3. `src/pages/Upsell2Page.tsx`**
- Mesma correcao do Upsell1: sanitizar com `validateCustomerForPix`

**4. `src/pages/Upsell4Page.tsx`**
- Mesma correcao do Upsell1: sanitizar com `validateCustomerForPix`

### Detalhes tecnicos

**Correcao do QR no PixPage** - Substituir o bloco condicional:
```text
ANTES: if (qrCodeBase64) -> mostra imagem, else -> mostra spinner
DEPOIS: construir qrImageSrc com fallback (igual ao PixPaymentModal):
  - Se qrCodeBase64 existe -> usa base64
  - Se so qrCode existe -> gera via api.qrserver.com
  - Se nenhum -> mostra "Carregando"
```

**Sanitizacao nos Upsells** - Em cada `handleOpenModal`:
```text
ANTES: passa dadosPessoais.cpf diretamente (com mascara)
DEPOIS: chama validateCustomerForPix(parsed) -> usa validation.customer (ja sanitizado)
```

### O que NAO precisa mudar
- `PixPaymentModal.tsx` - ja tem o fallback correto
- `Upsell3Page.tsx` - ja usa validateCustomerForPix
- `paradise-pix/index.ts` - backend ja sanitiza e valida
- `useParadisePix.ts` - hook estavel, sem alteracao

### Resultado esperado
- QR Code visual aparece em TODAS as paginas de pagamento (PixPage e modais dos upsells)
- Dados do cliente sao sempre sanitizados antes de enviar ao backend
- CPFs invalidos sao bloqueados no frontend com mensagem clara
