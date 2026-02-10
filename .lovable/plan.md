

## Remover logos ANVISA + gov.br da Index e manter apenas no funil principal

### Contexto
As logos na pagina Index (/) estao deixando os modais/cards muito grandes e prejudicando a estetica. O usuario quer manter as logos apenas nas paginas do funil de checkout.

### Alteracao

**Arquivo: `src/pages/Index.tsx`**
- Remover os imports de `anvisaLogo` e `govbrLogo`
- Remover o bloco JSX das logos ANVISA + gov.br (linhas 147-150)

### Paginas que manterao as logos (sem alteracao)
- `/dados-pessoais` - DadosPessoaisPage.tsx
- `/endereco` - EnderecoPage.tsx
- `/confirmacao` - ConfirmacaoPage.tsx
- `/pix` - PixPage.tsx

### Paginas sem logos (sem alteracao necessaria)
- `/` - Index.tsx (remover)
- `/mounjaro` - MounjaroPage.tsx (ja nao tem)
- `/rastreio` - RastreioPage.tsx (remover tambem, pois esta fora do funil principal ate o pix)
- Upsells (ja nao tem)

### Resumo
- Editar `src/pages/Index.tsx`: remover imports e bloco de logos
- Editar `src/pages/RastreioPage.tsx`: remover imports e bloco de logos

