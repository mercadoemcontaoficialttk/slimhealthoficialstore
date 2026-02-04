

## Plano: Remover Texto de Suporte

### Alteracao
Remover a mensagem "Em caso de duvidas, entre em contato pelo email suporte@slimhealth.com.br" da pagina de rastreio.

---

### Arquivo a Modificar

| Arquivo | Acao |
|---------|------|
| src/pages/RastreioPage.tsx | EDITAR - Remover div com mensagem de suporte (linhas 267-273) |

---

### Codigo a Remover

```tsx
{/* Mensagem de suporte (estática) */}
<div className="text-center py-3">
  <p className="text-sm text-gray-500">
    Em caso de dúvidas, entre em contato pelo email{" "}
    <span className="font-medium text-gray-700">suporte@slimhealth.com.br</span>
  </p>
</div>
```

---

### Resultado

A pagina de rastreio ficara apenas com:
- Card de confirmacao (verde)
- Timeline de status
- Previsao de entrega
- Endereco de entrega
- Resumo do pedido
- Badge de seguranca
- Logos SlimHealth + CIMED

Sem o texto de suporte entre o badge e os logos.

