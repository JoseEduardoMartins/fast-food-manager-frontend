/**
 * Order service types
 * Based on backend API documentation
 */

import type { SortConfig } from '@services/countries';
import type { OrderStatus, PaymentMethod, ConsumptionMode } from '@common/constants/orderEnums';

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
