/**
 * Order delivery service types
 * Based on backend API documentation
 */

import type { SortConfig } from '@services/countries';
import type { OrderDeliveryStatus } from '@common/constants/orderEnums';

export interface OrderDelivery {
  id: string;
  orderId: string;
  userId: string;
  status: OrderDeliveryStatus;
  note?: string;
  assignedAt?: string;
  deliveredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListOrderDeliveriesParams {
  pageIndex?: number;
  pageSize?: number;
  orderId?: string;
  userId?: string;
  status?: OrderDeliveryStatus;
  selectFields?: string[];
  sort?: SortConfig;
}

export interface ListOrderDeliveriesResponse {
  data: OrderDelivery[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateOrderDeliveryRequest {
  orderId: string;
  userId: string;
  status?: OrderDeliveryStatus;
  note?: string;
}

export interface UpdateOrderDeliveryRequest {
  status?: OrderDeliveryStatus;
  note?: string;
}

export interface CreateOrderDeliveryResponse {
  id: string;
}
