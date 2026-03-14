/**
 * Order service types
 * Based on backend API documentation
 */

import type { SortConfig } from '@services/countries';
import type { OrderStatus, PaymentMethod, ConsumptionMode } from '@common/constants/orderEnums';
import type { User } from '@services/users';
import type { Address } from '@services/addresses';

/**
 * Branch (minimal) for order display
 */
export interface Branch {
  id: string;
  name: string;
  nickname?: string;
  companyId: string;
  phone?: string;
  isActive: boolean;
}

/**
 * OrderDelivery (minimal) for order display
 */
export interface OrderDeliveryInfo {
  id: string;
  orderId: string;
  userId: string;
  status: string;
  assignedAt?: string;
  deliveredAt?: string;
  note?: string;
  deliveryUser?: User;
}

export interface Order {
  id: string;
  clientId?: string;
  attendantId?: string;
  branchId: string;
  status: OrderStatus;
  total: number;
  paymentMethod?: PaymentMethod;
  consumptionMode: ConsumptionMode;
  deliveryAddressId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relações (quando incluídas via selectFields)
  client?: User;
  attendant?: User;
  branch?: Branch;
  deliveryAddress?: Address;
  orderDelivery?: OrderDeliveryInfo;
}

export interface ListOrdersParams {
  pageIndex?: number;
  pageSize?: number;
  clientId?: string;
  attendantId?: string;
  branchId?: string;
  status?: OrderStatus;
  total?: number;
  paymentMethod?: PaymentMethod;
  consumptionMode?: ConsumptionMode;
  selectFields?: string[];
  ids?: number[];
  ignoredIds?: number[];
  sort?: SortConfig;
}

export interface ListOrdersResponse {
  data: Order[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateOrderRequest {
  branchId: string;
  total: number;
  consumptionMode: ConsumptionMode;
  deliveryAddressId?: string;
  clientId?: string;
  attendantId?: string;
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  paymentMethod?: PaymentMethod;
  consumptionMode?: ConsumptionMode;
  deliveryAddressId?: string;
  total?: number;
  clientId?: string;
  attendantId?: string;
}

export interface CreateOrderResponse {
  id: string;
}
