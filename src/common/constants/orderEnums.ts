/**
 * Order-related enums and labels
 * Based on backend API documentation
 */

export const ORDER_STATUS = {
  received: 'received',
  preparing: 'preparing',
  ready: 'ready',
  delivered: 'delivered',
  cancelled: 'cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATUS.received]: 'Recebido',
  [ORDER_STATUS.preparing]: 'Em preparo',
  [ORDER_STATUS.ready]: 'Pronto para entrega',
  [ORDER_STATUS.delivered]: 'Entregue',
  [ORDER_STATUS.cancelled]: 'Cancelado',
};

/** Colunas do Kanban de pedidos e quais roles podem ver cada uma */
export const ORDER_KANBAN_COLUMNS: Array<{
  status: OrderStatus;
  label: string;
  /** Roles que veem esta coluna (admin/owner/manager veem todas via lógica no hook) */
  roles: Array<'admin' | 'owner' | 'manager' | 'cook' | 'attendant' | 'delivery'>;
}> = [
  { status: ORDER_STATUS.received, label: 'Recebido', roles: ['admin', 'owner', 'manager', 'cook'] },
  { status: ORDER_STATUS.preparing, label: 'Em preparo', roles: ['admin', 'owner', 'manager', 'cook'] },
  { status: ORDER_STATUS.ready, label: 'Pronto para entrega', roles: ['admin', 'owner', 'manager', 'cook', 'attendant', 'delivery'] },
  { status: ORDER_STATUS.delivered, label: 'Entregue', roles: ['admin', 'owner', 'manager', 'attendant', 'delivery'] },
];

/** Status que não aparecem no Kanban (ex.: cancelados) */
export const ORDER_STATUS_EXCLUDED_FROM_KANBAN: OrderStatus[] = [ORDER_STATUS.cancelled];

export const PAYMENT_METHOD = {
  cash: 'cash',
  debit: 'debit',
  credit: 'credit',
  pix: 'pix',
  voucher: 'voucher',
} as const;

export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PAYMENT_METHOD.cash]: 'Dinheiro',
  [PAYMENT_METHOD.debit]: 'Débito',
  [PAYMENT_METHOD.credit]: 'Crédito',
  [PAYMENT_METHOD.pix]: 'PIX',
  [PAYMENT_METHOD.voucher]: 'Vale',
};

export const CONSUMPTION_MODE = {
  local: 'local',
  takeout: 'takeout',
  delivery: 'delivery',
} as const;

export type ConsumptionMode = (typeof CONSUMPTION_MODE)[keyof typeof CONSUMPTION_MODE];

export const CONSUMPTION_MODE_LABELS: Record<ConsumptionMode, string> = {
  [CONSUMPTION_MODE.local]: 'No local',
  [CONSUMPTION_MODE.takeout]: 'Para viagem',
  [CONSUMPTION_MODE.delivery]: 'Entrega',
};

export const ORDER_DELIVERY_STATUS = {
  assigned: 'assigned',
  in_transit: 'in_transit',
  delivered: 'delivered',
  failed: 'failed',
} as const;

export type OrderDeliveryStatus =
  (typeof ORDER_DELIVERY_STATUS)[keyof typeof ORDER_DELIVERY_STATUS];

export const ORDER_DELIVERY_STATUS_LABELS: Record<OrderDeliveryStatus, string> = {
  [ORDER_DELIVERY_STATUS.assigned]: 'Atribuído',
  [ORDER_DELIVERY_STATUS.in_transit]: 'Em trânsito',
  [ORDER_DELIVERY_STATUS.delivered]: 'Entregue',
  [ORDER_DELIVERY_STATUS.failed]: 'Falhou',
};

export type OrderKanbanRole = 'admin' | 'owner' | 'manager' | 'cook' | 'attendant' | 'delivery';

/** Retorna as colunas do Kanban visíveis para o role (admin/owner/manager veem todas) */
export function getOrderKanbanColumnsForRole(
  role: OrderKanbanRole
): Array<{ status: OrderStatus; label: string }> {
  const fullAccess = role === 'admin' || role === 'owner' || role === 'manager';
  if (fullAccess) {
    return ORDER_KANBAN_COLUMNS.map((c) => ({ status: c.status, label: c.label }));
  }
  return ORDER_KANBAN_COLUMNS.filter((c) => c.roles.includes(role)).map((c) => ({
    status: c.status,
    label: c.label,
  }));
}
