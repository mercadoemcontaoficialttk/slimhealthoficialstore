
## Adicionar Banner + Texto na Pagina de Dados Pessoais

### O que sera feito

1. **Copiar o banner** (`Gemini_Generated_Image_bhf7fsbhf7fsbhf7.png`) para `src/assets/banners/estoque-interno.png`

2. **Editar `src/pages/DadosPessoaisPage.tsx`** -- adicionar entre o header (progress bar) e o product card:
   - A imagem do banner com cantos arredondados, ocupando a largura total (dentro do container `mx-3 mt-3`)
   - Abaixo do banner, um paragrafo centralizado em cinza com o texto:
     > "Este valor é mais baixo porque este lote fazia parte do estoque interno destinado a funcionários da SlimHealth e Cimed. Como restaram algumas unidades, a empresa decidiu liberar o último lote ao público mantendo o mesmo valor interno de R$ 67,90."

### Posicionamento

O banner e texto ficam logo apos o header (com a barra de progresso), antes da section do product card -- exatamente como mostrado na imagem de referencia.

### Detalhes tecnicos

- Importar a imagem do banner como modulo ES6
- Banner: `rounded-xl overflow-hidden` dentro de `mx-3 mt-3`
- Texto: `text-center text-sm text-slate-500 font-medium px-4 mt-2` abaixo do banner
- Nenhuma outra alteracao na pagina
