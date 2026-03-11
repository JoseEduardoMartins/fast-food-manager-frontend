/**
 * Order item service types
 * Based on backend API documentation
 */

import type { SortConfig } from '@services/countries';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListOrderItemsParams {
  pageIndex?: number;
  pageSize?: number;
  orderId?: string;
  productId?: string;
  quantity?: number;
  selectFields?: string[];
  sort?: SortConfig;
}

export interface ListOrderItemsResponse {
  data: OrderItem[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateOrderItemRequest {
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  note?: string;
}

export interface UpdateOrderItemRequest {
  quantity?: number;
  unitPrice?: number;
  note?: string;
}

export interface CreateOrderItemResponse {
  id: string;
}
