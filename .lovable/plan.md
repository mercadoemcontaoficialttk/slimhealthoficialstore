

## Adicionar logos ANVISA + gov.br no funil principal (sem upsells)

### Escopo atualizado

As logos serao adicionadas apenas nas paginas do funil principal:

| Pagina | Arquivo |
|--------|---------|
| Index (funil inicial) | `src/pages/Index.tsx` |
| Endereco | `src/pages/EnderecoPage.tsx` |
| Confirmacao | `src/pages/ConfirmacaoPage.tsx` |
| Pagamento PIX | `src/pages/PixPage.tsx` |
| Rastreio | `src/pages/RastreioPage.tsx` |

### Paginas excluidas
- MounjaroPage (pagina do produto, conforme solicitado antes)
- Upsell1Page, Upsell2Page, Upsell3Page, Upsell4Page (conforme solicitado agora)

### Alteracoes em cada arquivo

1. Adicionar imports no topo:
   - `import anvisaLogo from "@/assets/anvisa-logo.png";`
   - `import govbrLogo from "@/assets/govbr-logo.png";`

2. Inserir o bloco de logos no rodape/final do conteudo de cada pagina:

```text
<div className="mx-3 mt-4 mb-2 flex items-center justify-center gap-6 opacity-60">
  <img src={anvisaLogo} alt="ANVISA" className="h-10 w-auto" />
  <img src={govbrLogo} alt="gov.br" className="h-6 w-auto" />
</div>
```

### Posicionamento por pagina
- **Index.tsx**: Dentro do CardContent, abaixo do logo CIMED (steps 2/3) ou abaixo do botao (step 1)
- **EnderecoPage.tsx**: Acima do footer fixo, abaixo dos security badges
- **ConfirmacaoPage.tsx**: Acima do footer fixo, abaixo dos security badges
- **PixPage.tsx**: No final do conteudo scrollavel
- **RastreioPage.tsx**: No final da pagina, abaixo das logos SlimHealth+CIMED existentes

Nenhuma outra alteracao nos arquivos. Estilo identico ao ja implementado em DadosPessoaisPage.

