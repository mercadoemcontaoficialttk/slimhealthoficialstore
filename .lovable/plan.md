
## Plano: Adicionar Logo CIMED nos Steps 2 e 3

### O que sera feito

Adicionar a logo da CIMED embaixo do botao "Continuar" nos Steps 2 (nome) e 3 (idade), de forma pequena e centralizada para um visual mais profissional.

---

### Mudancas em `src/pages/Index.tsx`

A logo da CIMED ja esta importada no arquivo (linha 8):
```
import cimedLogo from "@/assets/cimed-logo.png";
```

Preciso adicionar a logo apenas quando estivermos nos Steps 2 ou 3, logo apos o botao "Continuar".

**Apos o botao (linha 128):**

Adicionar a logo da CIMED com as seguintes caracteristicas:
- Tamanho pequeno: `h-8` (32px de altura)
- Centralizada: usando flexbox ou `mx-auto`
- Opacidade suave para nao competir com o botao: `opacity-60`
- Pequeno espacamento superior: `mt-4`
- Condicional: aparece apenas nos steps 2 e 3

Antes:
```text
          </Button>
        </CardContent>
      </Card>
```

Depois:
```text
          </Button>
          
          {/* CIMED Logo - Steps 2 e 3 */}
          {(step === 2 || step === 3) && (
            <img 
              src={cimedLogo} 
              alt="CIMED" 
              className="h-8 object-contain opacity-60 mt-4"
            />
          )}
        </CardContent>
      </Card>
```

---

### Resultado Visual

| Aspecto | Detalhe |
|---------|---------|
| Posicao | Centralizada embaixo do botao |
| Tamanho | Pequena (32px de altura) |
| Aparencia | Suave com opacidade 60% |
| Condicao | Aparece apenas nos Steps 2 e 3 |

---

### Resumo das Alteracoes

| Arquivo | Mudanca |
|---------|---------|
| src/pages/Index.tsx | Adicionar logo CIMED condicional apos o botao |
