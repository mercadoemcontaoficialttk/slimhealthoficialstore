

## Plano: Ajustar Estetica do Funil para Corresponder as Referencias

### Visao Geral
Ajustar os estilos visuais das 3 etapas do funil para corresponder exatamente as imagens de referencia fornecidas.

---

### Mudancas no Step 1 (Pre-sell)

**Logos:**
- Aumentar tamanho do logo SlimHealth para `h-16 md:h-20` (aproximadamente 64-80px)
- Aumentar tamanho do logo CIMED para `h-12 md:h-14` (aproximadamente 48-56px)
- O sinal "+" permanece entre eles em cinza

**Mensagem de Oferta:**
- Aumentar tamanho do texto para `text-xl md:text-2xl`
- Manter primeira parte em bold e segunda em peso normal

**Alerta de Escassez:**
- Fundo creme/amarelo muito claro: `bg-[#FFF8E7]`
- Borda amarela/dourada: `border-[#F5C842]`
- Bordas mais arredondadas: `rounded-xl`
- Icone em circulo amarelo claro
- Texto em cor laranja/ambar: `text-[#D97706]`

**Botao:**
- Bordas muito arredondadas (pill): `rounded-full`
- Verde CTA padrao quando habilitado

---

### Mudancas nos Steps 2 e 3 (Nome e Idade)

**Titulos:**
- Tamanho maior: `text-2xl md:text-3xl`
- Peso extra bold: `font-extrabold`
- Cor quase preta: `text-[#1a1a2e]`

**Subtitulos:**
- Cor cinza mais clara: `text-gray-400`
- Tamanho mantido

**Inputs:**
- Remover borda: `border-0`
- Fundo cinza claro: `bg-[#F1F3F8]`
- Bordas muito arredondadas: `rounded-2xl`
- Altura maior: `h-14`
- Placeholder em cinza medio

**Botao Desabilitado:**
- Fundo cinza-azulado: `bg-[#C5CAD4]`
- Texto branco: `text-white`
- Bordas muito arredondadas: `rounded-full`

**Botao Habilitado:**
- Verde CTA: `bg-cta`
- Texto branco
- Bordas muito arredondadas: `rounded-full`

---

### Arquivo a Modificar

`src/pages/Index.tsx`:
- Ajustar classes de tamanho dos logos
- Ajustar estilos do alerta de escassez
- Ajustar tipografia dos titulos e subtitulos
- Ajustar estilos dos inputs
- Ajustar estilos do botao para estados habilitado/desabilitado

---

### Detalhes Tecnicos

```text
Step 1 (Pre-sell):
+-------------------+
|  [SlimHealth] +   |  <- Logos maiores
|     [CIMED]       |
|                   |
| Voce vai garantir |  <- Texto maior
|   nosso produto   |
|                   |
| +---------------+ |
| | ! Restam 19   | |  <- Fundo creme, texto laranja
| +---------------+ |
|                   |
| [  Continuar   ]  |  <- Botao verde pill
+-------------------+

Steps 2 e 3 (Nome/Idade):
+-------------------+
|                   |
| Antes de continuar|  <- Titulo grande, bold
|                   |
| Precisamos saber..|  <- Subtitulo cinza claro
|                   |
| +---------------+ |
| | Digite seu... | |  <- Input cinza, sem borda
| +---------------+ |
|                   |
| [  Continuar   ]  |  <- Botao cinza-azulado ou verde
+-------------------+
```

