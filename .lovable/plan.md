

## Plano: Criar Pagina Upsell 4 - Erro no Processamento

### Visao Geral
O Upsell 4 e a ultima etapa do funil. Simula um "erro no processamento do reembolso" e solicita o pagamento de R$ 35,20 para confirmar e iniciar o reembolso. Possui uma tela de loading inicial e depois exibe o conteudo principal.

---

### 1. Fluxo de Usuario

```text
Fase 1 - Validacao (3 segundos):
+------------------------------------------+
|                                          |
|                                          |
|            [Spinner Rosa]                |
|                                          |
|     Processando seu pagamento...         |
|                                          |
|        Erro na transacao                 |  <- Aparece apos 2s
|                                          |
+------------------------------------------+

Fase 2 - Conteudo Principal:
+------------------------------------------+
|         [TikTok Logo]                    |
+------------------------------------------+
|                                          |
|  +------------------------------------+  |
|  |           [X icone 3D]             |  |  <- Card destaque
|  |                                    |  |
|  |      Erro no Processamento         |  |
|  |                                    |  |
|  |  Identificamos uma falha no        |  |
|  |  processamento do seu reembolso.   |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  | [i] Processo de Reembolso          |  |  <- Card informativo
|  |                                    |  |
|  |  * O valor sera reembolsado apos   |  |
|  |    confirmacao                     |  |
|  |  * Reembolso na mesma forma de     |  |
|  |    pagamento                       |  |
|  |  * Prazo varia conforme banco      |  |
|  +------------------------------------+  |
|                                          |
|  +------------------------------------+  |
|  |    VALOR A SER REEMBOLSADO         |  |  <- Card valor
|  |                                    |  |
|  |          R$ 35,20                  |  |
|  |                                    |  |
|  |  Clique abaixo para confirmar o    |  |
|  |  pagamento e iniciar o reembolso   |  |
|  +------------------------------------+  |
|                                          |
|  [   CONFIRMAR PAGAMENTO   ]             |  <- Botao rosa
|                                          |
|  [escudo] Pagamento 100% seguro          |
|                                          |
|  Em caso de duvidas, nossa Central       |
|  de Ajuda esta disponivel 24h            |
|                                          |
|       [SlimHealth] + [CIMED]             |
|                                          |
+------------------------------------------+
```

---

### 2. Estrutura dos Cards

**Card 1 - Erro (destaque com borda rosa):**
- Fundo: rosa claro (`bg-rose-50`)
- Borda: rosa (`border-2 border-rose-500`)
- Icone: X vermelho em circulo 3D animado (pulse)
- Titulo: "Erro no Processamento" (cor rosa, extra-bold)
- Subtitulo: "Identificamos uma falha no processamento do seu reembolso..."

**Card 2 - Informacoes (borda lateral rosa):**
- Fundo: cinza claro (`bg-gray-50`)
- Borda esquerda: rosa (`border-l-4 border-rose-500`)
- Icone: Info rosa
- Titulo: "Processo de Reembolso"
- Lista com 3 itens explicativos

**Card 3 - Valor:**
- Fundo: branco com sombra
- Borda: rosa clara (`border border-rose-100`)
- Titulo: "VALOR A SER REEMBOLSADO" (cinza, uppercase)
- Valor: "R$ 35,20" (tamanho grande, rosa, extra-bold, com linha decorativa)
- Nota: Texto explicativo

---

### 3. Arquivos a Modificar/Criar

| Arquivo | Acao |
|---------|------|
| src/pages/Upsell4Page.tsx | CRIAR - Nova pagina do Upsell 4 |
| src/App.tsx | EDITAR - Adicionar rota /upsell4 |
| src/pages/Upsell3Page.tsx | EDITAR - Redirecionar para /upsell4 apos simular pagamento |

---

### 4. Estados do Componente

```tsx
// Fase atual: 'loading' ou 'content'
const [phase, setPhase] = useState<'loading' | 'content'>('loading');

// Texto de erro visivel (aparece apos 2s)
const [showError, setShowError] = useState(false);

// Modal de pagamento
const [showModal, setShowModal] = useState(false);
const [timeLeft, setTimeLeft] = useState(900);
```

---

### 5. Icones 3D para os Cards

**Card 1 - Erro (animado com pulse):**
```tsx
<div className="w-[70px] h-[70px] rounded-full flex items-center justify-center mx-auto mb-5
  bg-gradient-to-br from-rose-500 to-rose-600
  shadow-[0_8px_24px_rgba(244,63,94,0.4)]
  animate-pulse">
  <XCircle className="w-9 h-9 text-white" />
</div>
```

**Card 2 - Info:**
```tsx
<div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
  <Info className="w-5 h-5 text-rose-500" />
</div>
```

---

### 6. Animacoes

| Fase | Tempo | Acao |
|------|-------|------|
| 1 | 0s | Mostra spinner + "Processando seu pagamento..." |
| 1 | 2s | Aparece "Erro na transacao" com fade-in |
| 2 | 3s | Esconde loading, mostra conteudo principal |

---

### 7. Modal de Pagamento

Mesmo formato dos outros upsells:
- Header com logo TikTok
- Titulo: "Confirmacao de Reembolso"
- Valor: R$ 35,20
- QR Code simulado
- Botao copiar PIX
- Timer 15 minutos
- Aguardando confirmacao
- Botao simular pagamento (redireciona para Home ou pagina final)

---

### 8. Estilizacao Consistente

| Elemento | Estilo |
|----------|--------|
| Fundo pagina | `bg-gradient-to-br from-white to-gray-50` |
| Container central | `bg-white rounded-3xl shadow-lg border border-gray-100 p-8` |
| Card erro | `bg-rose-50 rounded-2xl border-2 border-rose-500 p-6` |
| Card info | `bg-gray-50 rounded-2xl border-l-4 border-rose-500 p-5` |
| Card valor | `bg-white rounded-2xl shadow-md border border-rose-100 p-6` |
| Botao principal | `bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl font-bold shadow-lg` |
| Badge seguranca | `bg-gray-50 rounded-xl` com icone escudo verde |
| Texto suporte | `bg-gray-50 rounded-xl border-l-3 border-rose-500` |
| Logos rodape | SlimHealth + CIMED, `opacity-70` |

---

### 9. Elementos Especiais

**Valor destacado com linha decorativa:**
```tsx
<p className="text-5xl font-extrabold text-rose-500 relative inline-block">
  R$ 35,20
  <span className="absolute bottom-[-5px] left-[10%] w-[80%] h-[3px] 
    bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded" />
</p>
```

**Badge de seguranca:**
```tsx
<div className="flex items-center justify-center gap-3 bg-gray-50 rounded-xl p-4">
  <Shield className="w-5 h-5 text-green-500" />
  <span className="text-sm text-gray-600 font-medium">
    Pagamento 100% seguro e criptografado
  </span>
</div>
```

**Link de ajuda:**
```tsx
<p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 border-l-3 border-rose-500">
  Em caso de duvidas, nossa{' '}
  <a href="#" className="text-rose-500 font-semibold hover:underline">Central de Ajuda</a>
  {' '}esta disponivel 24h...
</p>
```

---

### 10. Valor do Upsell

Conforme solicitado: **R$ 35,20**

---

### Resultado Esperado

1. Pagina inicia com tela de loading (spinner + texto erro)
2. Apos 3 segundos, exibe conteudo principal
3. Card de erro destacado com icone 3D animado
4. Card informativo sobre processo de reembolso
5. Card com valor grande e destaque visual
6. Botao "CONFIRMAR PAGAMENTO" abre modal one-click
7. Badge de seguranca e texto de suporte
8. Logos SlimHealth + CIMED no rodape
9. Visual 100% consistente com os outros upsells

