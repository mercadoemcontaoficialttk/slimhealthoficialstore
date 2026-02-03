

## Plano: Adicionar Passos de Captura de Lead ao Funil

### Visao Geral
Transformar a pagina inicial em um funil multi-step com 3 etapas:
1. **Passo 1** (atual): Pre-sell com logos e alerta de escassez
2. **Passo 2** (novo): Captura do nome do lead
3. **Passo 3** (novo): Confirmacao de idade (maior de 18)

O botao "Continuar" fica desabilitado (cinza) ate o usuario preencher o campo, entao fica verde.

---

### Estrutura do Fluxo

```text
+------------------+     +------------------+     +------------------+     +------------------+
|    Passo 1       | --> |    Passo 2       | --> |    Passo 3       | --> |    Checkout      |
|   Pre-sell       |     |   Nome           |     |   Idade          |     |   (aguardando)   |
+------------------+     +------------------+     +------------------+     +------------------+
```

---

### Detalhes de Implementacao

**Passo 2 - Captura de Nome:**
- Titulo: "Antes de continuar" (bold, preto)
- Subtitulo: "Precisamos saber seu nome para prosseguir." (cinza)
- Input de texto com placeholder "Digite seu nome"
- Input com borda verde suave e bordas arredondadas
- Botao "Continuar" desabilitado (cinza) quando vazio
- Botao fica verde quando nome preenchido

**Passo 3 - Confirmacao de Idade:**
- Titulo: "Confirme sua idade" (bold, preto)
- Subtitulo: "Este produto e destinado apenas para maiores de 18 anos." (cinza)
- Input numerico com placeholder "Digite sua idade"
- Botao "Continuar" desabilitado (cinza) quando vazio
- Botao fica verde quando idade preenchida
- Ao clicar, navega para /checkout

---

### Mudancas Tecnicas

1. **Modificar `src/pages/Index.tsx`:**
   - Adicionar estado para controlar o passo atual (1, 2, 3)
   - Adicionar estados para nome e idade
   - Renderizar conteudo diferente baseado no passo atual
   - Logica de validacao para habilitar/desabilitar botao

2. **Estilos do Botao:**
   - Desabilitado: fundo cinza claro (`bg-gray-300`)
   - Habilitado: fundo verde CTA (`bg-cta`)
   - Texto sempre em branco/claro

3. **Estilos do Input:**
   - Borda verde suave
   - Bordas bem arredondadas
   - Fundo cinza muito claro

---

### Dados do Lead
Os dados (nome e idade) serao armazenados em estado local por enquanto. Posteriormente podem ser enviados para um backend ou passados para a pagina de checkout.

