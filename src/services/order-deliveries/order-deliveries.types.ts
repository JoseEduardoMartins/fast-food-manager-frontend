/**
 * Order Deliveries service types
 * Based on backend API documentation
 */

import type { Order } from '@services/orders';
import type { User } from '@services/users';
import type { OrderDeliveryStatus } from '@common/constants/orderEnums';

/**
 * OrderDelivery data structure
 */
export interface OrderDelivery {
  id: string;
  orderId: string;
  userId: string;
  status: OrderDeliveryStatus;
  assignedAt?: string;
  deliveredAt?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  order?: Order;
  deliveryUser?: User;
}

/**
 * Create order delivery request
 */
export interface CreateOrderDeliveryRequest {
  orderId: string;
  userId: string;
  status?: OrderDeliveryStatus;
  note?: string;
}

/**
 * Update order delivery request
 */
export interface UpdateOrderDeliveryRequest {
  status?: OrderDeliveryStatus;
  note?: string;
}

/**
 * Create order delivery response
 */
export interface CreateOrderDeliveryResponse {
  id: string;
}

/**
 * List order deliveries query params
 */
export interface ListOrderDeliveriesParams {
  pageIndex?: number;
  pageSize?: number;
  orderId?: string;
  userId?: string;
  status?: OrderDeliveryStatus;
  selectFields?: string[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * List order deliveries response
 */
export interface ListOrderDeliveriesResponse {
  data: OrderDelivery[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}
