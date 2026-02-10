

## Ajustes na Pagina de Dados Pessoais

### 1. Reduzir o texto abaixo do banner
- Diminuir o tamanho da fonte de `text-sm` para `text-xs`
- Reduzir o padding horizontal
- Resultado: texto mais compacto e proporcional ao banner, como na referencia

### 2. Adicionar logos ANVISA + gov.br centralizadas
- Copiar as duas imagens para `src/assets/`:
  - `anvisa-logo-png_seeklogo-9430.png` -> `src/assets/anvisa-logo.png`
  - `logo-2.png` -> `src/assets/govbr-logo.png`
- Adicionar uma section abaixo dos security badges (acima do footer fixo) com as duas logos centralizadas lado a lado
- Logos pequenas (h-10 para ANVISA, h-6 para gov.br) com opacidade sutil, como no print de referencia

### Detalhes tecnicos
- Importar as imagens como modulos ES6
- Container com `flex items-center justify-center gap-6` e fundo cinza claro
- Posicionar entre o formulario e os security badges fixos

