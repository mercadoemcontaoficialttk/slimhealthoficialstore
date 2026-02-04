

## Plano: Criar Pagina de Rastreio Profissional

### Visao Geral
A pagina de rastreio sera exibida apos o pagamento do Upsell 4, mostrando ao lead que seu pedido foi confirmado e esta sendo separado para envio. A pagina deve transmitir credibilidade e profissionalismo.

---

### 1. Layout da Pagina

```text
+------------------------------------------+
|         [TikTok Shop Logo]               |
+------------------------------------------+
|                                          |
|  +------------------------------------+  |
|  |        [✓ icone 3D verde]          |  |
|  |                                    |  |
|  |      Pedido Confirmado!            |  |
|  |                                    |  |
|  |  Seu pedido #XXXX foi recebido     |  |
|  |  e esta sendo processado           |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |  Status do Pedido                  |  |
|  |                                    |  |
|  |  ● Pedido recebido      [✓]        |  |
|  |  |                                 |  |
|  |  ● Separando produtos   [○ pulse]  |  |  <- Status atual
|  |  |                                 |  |
|  |  ○ Enviado              [ ]        |  |
|  |  |                                 |  |
|  |  ○ Em transito          [ ]        |  |
|  |  |                                 |  |
|  |  ○ Entregue             [ ]        |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |  [caminhao] Previsao de Entrega    |  |
|  |                                    |  |
|  |  DD de MES de AAAA                 |  |
|  |  (baseado no frete escolhido)      |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |  [mapa] Endereco de Entrega        |  |
|  |                                    |  |
|  |  Rua, Numero                       |  |
|  |  Bairro - Cidade/UF                |  |
|  |  CEP: 00000-000                    |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |  [caixa] Resumo do Pedido          |  |
|  |                                    |  |
|  |  Mounjaro 5mg x Qtd    R$ XX,XX    |  |
|  |  Frete                 R$ XX,XX    |  |
|  |  --------------------------        |  |
|  |  Total                 R$ XX,XX    |  |
|  +------------------------------------+  |
|                                          |
|  [escudo] Pagamento 100% seguro          |
|                                          |
|       [SlimHealth] + [CIMED]             |
|                                          |
+------------------------------------------+
```

---

### 2. Elementos Principais

**Card 1 - Confirmacao (verde, destaque):**
- Fundo: verde claro (`bg-emerald-50`)
- Borda: verde (`border-2 border-emerald-500`)
- Icone: Check verde 3D animado (pulse suave)
- Titulo: "Pedido Confirmado!" (verde, extra-bold)
- Numero do pedido gerado automaticamente
- Mensagem de confirmacao

**Card 2 - Timeline de Status:**
- Fundo: branco com sombra
- 5 etapas com linha conectora vertical
- Etapas concluidas: icone check verde, texto escuro
- Etapa atual: icone pulsante, badge "Em andamento"
- Etapas pendentes: icone cinza, texto cinza

**Card 3 - Previsao de Entrega:**
- Fundo: azul claro (`bg-blue-50`)
- Borda esquerda azul
- Icone: Truck azul
- Data calculada baseada no frete selecionado
- Texto do tipo de frete escolhido

**Card 4 - Endereco de Entrega:**
- Fundo: cinza claro (`bg-gray-50`)
- Icone: MapPin
- Dados do endereco do localStorage

**Card 5 - Resumo do Pedido:**
- Fundo: branco com sombra
- Lista de itens com precos
- Separador
- Total destacado

---

### 3. Calculo da Data de Entrega

Baseado no frete selecionado:
- **Frete Gratis (FULL)**: +10 a 12 dias
- **JADLOG**: +5 dias uteis
- **SEDEX 12**: +1 dia

A data sera calculada dinamicamente usando `date-fns`.

---

### 4. Numero do Pedido

Gerar um numero de pedido aleatorio no formato:
`#TK` + 6 digitos (ex: #TK847293)

Salvar no localStorage para consistencia.

---

### 5. Estados da Timeline

| Etapa | Status Inicial | Icone |
|-------|----------------|-------|
| Pedido recebido | Concluido | Check verde |
| Separando produtos | Em andamento | Circle pulsante |
| Enviado | Pendente | Circle cinza |
| Em transito | Pendente | Circle cinza |
| Entregue | Pendente | Circle cinza |

---

### 6. Arquivos a Modificar/Criar

| Arquivo | Acao |
|---------|------|
| src/pages/RastreioPage.tsx | CRIAR - Nova pagina de rastreio |
| src/App.tsx | EDITAR - Adicionar rota /rastreio |
| src/pages/Upsell4Page.tsx | EDITAR - Redirecionar para /rastreio apos simular pagamento |

---

### 7. Estilizacao Consistente

| Elemento | Estilo |
|----------|--------|
| Fundo pagina | `bg-gradient-to-br from-white to-gray-50` |
| Container central | `bg-white rounded-3xl shadow-lg border border-gray-100 p-6` |
| Card confirmacao | `bg-emerald-50 rounded-2xl border-2 border-emerald-500 p-6` |
| Card previsao | `bg-blue-50 rounded-2xl border-l-4 border-blue-500 p-5` |
| Card endereco | `bg-gray-50 rounded-2xl p-5` |
| Card resumo | `bg-white rounded-2xl shadow-md p-5` |
| Badge seguranca | `bg-gray-50 rounded-xl` com icone escudo verde |
| Logos rodape | SlimHealth + CIMED, `opacity-70` |

---

### 8. Icones 3D

**Icone de Confirmacao (verde, pulsante suave):**
```tsx
<div className="w-[70px] h-[70px] rounded-full flex items-center justify-center mx-auto mb-5
  bg-gradient-to-br from-emerald-400 to-emerald-600
  shadow-[0_8px_24px_rgba(16,185,129,0.4)]
  animate-pulse">
  <CheckCircle className="w-9 h-9 text-white" />
</div>
```

**Icones da Timeline:**
- Concluido: `bg-emerald-500` com Check branco
- Em andamento: `bg-amber-500` com animacao pulse
- Pendente: `bg-gray-200` sem icone

---

### 9. Dados do LocalStorage Utilizados

```tsx
// Recuperar dados
const dadosPessoais = JSON.parse(localStorage.getItem('dadosPessoais') || '{}');
const endereco = JSON.parse(localStorage.getItem('endereco') || '{}');
const frete = JSON.parse(localStorage.getItem('frete') || '{}');
const pedido = JSON.parse(localStorage.getItem('pedido') || '{}');
```

---

### 10. Recursos Adicionais

- **Botao "Precisa de Ajuda?"**: Link para suporte (pode abrir WhatsApp ou email)
- **Botao "Voltar para Loja"**: Navega para pagina inicial
- **Animacao de entrada**: Cards aparecem com fade-in suave

---

### Resultado Esperado

1. Apos pagamento do Upsell 4, lead e redirecionado para /rastreio
2. Pagina exibe confirmacao com numero do pedido
3. Timeline mostra status atual (separando produtos)
4. Previsao de entrega calculada baseada no frete
5. Endereco de entrega exibido
6. Resumo completo do pedido
7. Visual profissional e confiavel
8. Botoes de acao para suporte e retorno

