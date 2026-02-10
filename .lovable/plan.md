

## Trocar logo gov.br em todas as paginas do funil

### O que sera feito

1. Salvar a nova imagem enviada como `src/assets/govbr-logo.png` (substituindo a atual)
2. Nenhuma alteracao de codigo necessaria -- os 4 arquivos ja importam de `@/assets/govbr-logo.png`

### Paginas afetadas (automaticamente pela troca do arquivo)
- `/dados-pessoais` - DadosPessoaisPage.tsx
- `/endereco` - EnderecoPage.tsx
- `/confirmacao` - ConfirmacaoPage.tsx
- `/pix` - PixPage.tsx

### Detalhes tecnicos
- Copiar `user-uploads://Gov.br_logo.svg_1.png` para `src/assets/govbr-logo.png`, sobrescrevendo o arquivo antigo
- Como todos os imports apontam para o mesmo caminho, a troca do arquivo e suficiente
- Nenhum arquivo `.tsx` precisa ser editado

