
## Plano: Atualizar Página do Mounjaro

### Resumo
Vou fazer várias alterações na página `/mounjaro` conforme solicitado:

---

### Alterações

#### 1. Trocar "2,5 mg" por "5mg" em todos os locais
Locais afetados:
- Título do produto (linha 225)
- Detalhes do produto - campo "Produto" (linha 397)
- Detalhes do produto - campo "Princípio Ativo" (linha 400)
- Detalhes do produto - campo "Dosagem" (linha 412)
- Descrição do produto (linhas 430, 431, 439)

#### 2. Adicionar mais 5 avaliações de clientes
Vou expandir o array `reviews` de 3 para 8 avaliações, com novos nomes e textos variados. A contagem exibida também será atualizada de "(3)" para "(8)".

#### 3. Remover seção "Você também pode gostar"
Remover toda a seção de produtos recomendados (linhas 451-490), incluindo:
- O array `recommendedProducts`
- Os imports não utilizados: `prod1`, `prod2`, `prod3`, `prod4`

#### 4. Trocar nome da empresa
Alterar "Atakarejo Oficial" para "SlimHealth Oficial" na seção da loja (linha 368).

#### 5. Adicionar nova imagem ao carrossel
- Copiar a imagem enviada (`foto4.jpg`) para `src/assets/mounjaro/foto4.jpg`
- Importar a nova imagem no componente
- Adicionar ao array `productImages`

---

### Arquivos Modificados
- `src/pages/MounjaroPage.tsx` - Todas as alterações
- `src/assets/mounjaro/foto4.jpg` - Nova imagem copiada

---

### Resultado Esperado
A página do Mounjaro terá:
- Dosagem atualizada para 5mg em todos os textos
- 8 avaliações de clientes no total
- Seção de produtos recomendados removida
- Nome da loja como "SlimHealth Oficial"
- 4 imagens no carrossel de fotos do produto
