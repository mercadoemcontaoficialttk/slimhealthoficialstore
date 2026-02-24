

## Trocar valor de R$ 67,90 para R$ 67,23 em todo o front-end

### Arquivos que serao editados

1. **`src/pages/DadosPessoaisPage.tsx`**
   - Linha 15: `PRECO_UNITARIO = 67.90` → `67.23`
   - Linha 133: texto descritivo "R$ 67,90" → "R$ 67,23"

2. **`src/pages/EnderecoPage.tsx`**
   - Linha 15: `PRECO_UNITARIO = 67.90` → `67.23`

3. **`src/pages/ConfirmacaoPage.tsx`**
   - Linha 15: `PRECO_UNITARIO = 67.90` → `67.23`

4. **`src/pages/MounjaroPage.tsx`**
   - Linha 207: texto "R$ 67,90" → "R$ 67,23"

### Impacto
- O valor exibido em todas as paginas do funil (produto, dados pessoais, endereco, confirmacao) sera atualizado
- O calculo do total (produto + frete + bumps) sera recalculado automaticamente com o novo valor base
- O QR Code PIX na pagina `/pix` ja usa o total calculado, entao tambem refletira o novo valor sem alteracao adicional

