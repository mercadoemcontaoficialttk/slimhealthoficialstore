

## Plano: Remover Card de Endereço de Entrega

### Alteração
Remover o card "Endereço de Entrega" da página de rastreio conforme solicitado.

---

### Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| src/pages/RastreioPage.tsx | EDITAR - Remover card de endereço (linhas 175-206) |

---

### Código a Remover

```tsx
{/* Card 4 - Delivery Address */}
<div className="bg-gray-50 rounded-2xl p-5">
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
      <MapPin className="w-5 h-5 text-white" />
    </div>
    <div>
      <h2 className="font-bold text-[#1a1a2e] mb-1">
        Endereço de Entrega
      </h2>
      {endereco.rua ? (
        <>
          <p className="text-sm text-gray-600">
            {endereco.rua}, {endereco.numero}
            {endereco.complemento && ` - ${endereco.complemento}`}
          </p>
          <p className="text-sm text-gray-600">
            {endereco.bairro} - {endereco.cidade}/{endereco.uf}
          </p>
          <p className="text-sm text-gray-500">
            CEP: {endereco.cep}
          </p>
        </>
      ) : (
        <p className="text-sm text-gray-500">Endereço não disponível</p>
      )}
    </div>
  </div>
</div>
```

---

### Resultado

A página de rastreio ficará com:
- Card de confirmação (verde)
- Timeline de status
- Previsão de entrega
- Resumo do pedido
- Badge de segurança
- Logos SlimHealth + CIMED

Sem o card de endereço de entrega.

