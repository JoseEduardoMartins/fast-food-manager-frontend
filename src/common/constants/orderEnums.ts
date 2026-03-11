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
  [ORDER_STATUS.ready]: 'Pronto',
  [ORDER_STATUS.delivered]: 'Entregue',
  [ORDER_STATUS.cancelled]: 'Cancelado',
};

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
