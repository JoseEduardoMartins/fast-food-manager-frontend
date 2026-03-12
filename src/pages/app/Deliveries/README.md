# Sistema de Entregas (Delivery)

## Visão Geral

O sistema de entregas permite gerenciar pedidos delivery desde a atribuição de entregadores até a confirmação da entrega ao cliente.

## Páginas

### 1. Gerenciar Entregas (`/deliveries`)

**Acesso**: Admin, Owner, Manager

**Funcionalidades**:
- Lista pedidos com `consumptionMode = 'delivery'`
- Exibe pedidos nos status: `received`, `preparing`, `ready`, `in_transit`
- Permite atribuir entregador a pedidos com status `ready`
- Mostra informações:
  - ID do pedido
  - Nome do cliente
  - Endereço completo de entrega
  - Valor total
  - Status do pedido
  - Status da entrega (se já atribuída)
  - Nome do entregador (se já atribuído)

**Fluxo de Atribuição**:
1. Identificar pedido pronto (status `ready`)
2. Clicar no botão de atribuir entregador
3. Selecionar entregador no dropdown
4. Confirmar atribuição
5. Sistema cria registro de `OrderDelivery` com status `assigned`

### 2. Minhas Entregas (`/my-deliveries`)

**Acesso**: Delivery (Entregadores)

**Funcionalidades**:
- Lista entregas do usuário logado
- Exibe entregas nos status: `assigned`, `in_transit`
- Permite atualizar status da entrega
- Mostra informações:
  - ID do pedido
  - Valor total
  - Nome do cliente
  - Endereço completo (rua, número, complemento, cidade, estado, CEP)
  - Status da entrega

**Fluxo do Entregador**:

1. **Entrega Atribuída** (status `assigned`):
   - Visualiza card com detalhes da entrega
   - Clica em "Iniciar Entrega"
   - Status atualizado para `in_transit`

2. **Saiu para Entrega** (status `in_transit`):
   - Entrega o pedido ao cliente
   - Opções:
     - **"Confirmar Entrega"**: 
       - Solicita observação (opcional)
       - Atualiza entrega para `delivered`
       - Atualiza pedido para `delivered`
       - Remove da lista de entregas ativas
     - **"Marcar como Falha"**:
       - Solicita motivo da falha (obrigatório)
       - Atualiza entrega para `failed`
       - Remove da lista de entregas ativas

---

## Estrutura de Dados

### OrderDelivery
```typescript
{
  id: string;
  orderId: string;
  userId: string;              // ID do entregador
  status: OrderDeliveryStatus;
  assignedAt?: string;
  deliveredAt?: string;        // Auto-preenchido quando status = 'delivered'
  note?: string;               // Observações (ex: "Entregue ao porteiro")
  order?: Order;               // Dados completos do pedido
  deliveryUser?: User;         // Dados do entregador
}
```

### Order (com Delivery)
```typescript
{
  id: string;
  consumptionMode: 'delivery';
  deliveryAddressId: string;   // Obrigatório para delivery
  status: OrderStatus;
  // ... outros campos
  deliveryAddress?: Address;   // Endereço completo
  orderDelivery?: OrderDelivery; // Dados da entrega
}
```

---

## Hooks

### `useDeliveryList()`
Gerenciar lista de pedidos delivery para atribuição.

**Retorna**:
- `orders`: Array de pedidos delivery
- `deliveryUsers`: Array de entregadores disponíveis
- `loading`: Estado de carregamento
- `error`: Mensagem de erro
- `setError`: Limpar erro
- `assigning`: ID do pedido sendo atribuído (loading state)
- `assignDelivery(orderId, userId)`: Atribuir entregador
- `reload()`: Recarregar lista

**Exemplo**:
```typescript
const { orders, deliveryUsers, assignDelivery } = useDeliveryList();

// Atribuir entregador
await assignDelivery(orderId, deliveryUserId);
```

### `useMyDeliveries(userId)`
Gerenciar entregas do entregador logado.

**Parâmetros**:
- `userId`: ID do entregador logado

**Retorna**:
- `deliveries`: Array de entregas ativas do entregador
- `loading`: Estado de carregamento
- `error`: Mensagem de erro
- `setError`: Limpar erro
- `updating`: ID da entrega sendo atualizada (loading state)
- `startDelivery(deliveryId)`: Iniciar entrega (`in_transit`)
- `completeDelivery(deliveryId, note?)`: Confirmar entrega (`delivered`)
- `failDelivery(deliveryId, note)`: Marcar falha (`failed`)
- `reload()`: Recarregar lista

**Exemplo**:
```typescript
const { deliveries, startDelivery, completeDelivery } = useMyDeliveries(currentUser?.id);

// Iniciar entrega
await startDelivery(deliveryId);

// Confirmar entrega
await completeDelivery(deliveryId, 'Entregue ao cliente');
```

---

## Permissões RBAC

### Gerenciar Entregas
```typescript
allowedRoles: ['admin', 'owner', 'manager']
allowedPermissions: ['order-deliveries.list', 'order-deliveries.create']
```

### Minhas Entregas
```typescript
allowedRoles: ['delivery']
allowedPermissions: ['order-deliveries.list', 'order-deliveries.update']
```

---

## Serviços de API

### `createOrderDelivery(data)`
Atribui entregador a um pedido.

```typescript
await createOrderDelivery({
  orderId: 'uuid-do-pedido',
  userId: 'uuid-do-entregador',
  status: 'assigned', // default
});
```

### `updateOrderDelivery(id, data)`
Atualiza status da entrega.

```typescript
// Iniciar entrega
await updateOrderDelivery(deliveryId, { 
  status: 'in_transit' 
});

// Confirmar entrega
await updateOrderDelivery(deliveryId, { 
  status: 'delivered',
  note: 'Entregue ao cliente'
});

// Marcar falha
await updateOrderDelivery(deliveryId, { 
  status: 'failed',
  note: 'Cliente não encontrado'
});
```

### `listOrderDeliveries(params)`
Busca entregas com filtros.

```typescript
// Entregas do entregador
const { data } = await listOrderDeliveries({
  userId: 'uuid-entregador',
  status: 'in_transit',
  selectFields: ['id', 'status', 'order', 'deliveryUser'],
});

// Todas as entregas ativas
const { data } = await listOrderDeliveries({
  pageSize: 100,
  selectFields: ['id', 'status', 'order'],
});
```

---

## Componentes Reutilizáveis

### `AssignDeliveryButton`
Botão inline para atribuir entregador com select dropdown.

**Props**:
- `orderId`: ID do pedido
- `deliveryUsers`: Lista de entregadores disponíveis
- `onAssign(orderId, userId)`: Callback ao confirmar atribuição
- `isAssigning`: Loading state

**Comportamento**:
1. Clique inicial: Mostra select + botões de confirmar/cancelar
2. Seleciona entregador no dropdown
3. Confirma: Chama `onAssign` e fecha select
4. Cancela: Fecha select sem salvar

### `DeliveryCard`
Card de entrega para entregadores.

**Props**:
- `delivery`: Dados da entrega
- `onStart()`: Callback para iniciar entrega
- `onComplete()`: Callback para confirmar entrega
- `onFail()`: Callback para marcar falha
- `onViewOrder()`: Callback para ver pedido
- `isUpdating`: Loading state

**Exibe**:
- ID do pedido (8 primeiros chars)
- Valor total formatado
- Badge de status
- Nome do cliente
- Endereço completo com ícone
- Botões contextuais por status

---

## Helpers

### `formatAddress(address)`
Formata endereço em objeto com múltiplas linhas.

```typescript
const formatted = formatAddress(address);
// {
//   line1: "Rua das Flores, 123",
//   line2: "São Paulo - SP",
//   zipcode: "01234-567"
// }
```

### `formatAddressOneLine(address)`
Formata endereço em uma linha.

```typescript
const formatted = formatAddressOneLine(address);
// "Rua das Flores, 123, São Paulo, SP"
```

---

## Validações

### Cliente faz pedido delivery
- ✅ `consumptionMode = 'delivery'`
- ✅ `deliveryAddressId` obrigatório
- ✅ Endereço deve existir em `userAddresses`

### Atribuir entregador
- ✅ Pedido deve ter `consumptionMode = 'delivery'`
- ✅ Pedido deve estar com status `ready`
- ✅ Usuário selecionado deve ter role `delivery`
- ✅ Usuário deve estar `isActive = true`

### Atualizar entrega
- ✅ Apenas o entregador atribuído pode atualizar
- ✅ Transições válidas:
  - `assigned` → `in_transit`
  - `in_transit` → `delivered`
  - `in_transit` → `failed`

---

## Próximas Melhorias

1. **Push Notifications**: Notificar entregador de nova entrega
2. **Mapa**: Integrar Google Maps/OpenStreetMap
3. **Tempo Real**: Websocket para status ao vivo
4. **Otimização**: Sugerir melhor entregador baseado em localização
5. **Histórico**: Página com entregas completadas/falhadas
6. **Métricas**: Dashboard com KPIs de delivery

