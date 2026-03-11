/**
 * Order service
 * CRUD operations for orders
 * Based on backend API documentation
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  CreateOrderResponse,
  ListOrdersParams,
  ListOrdersResponse,
} from './orders.types';

export const listOrders = async (
  params?: ListOrdersParams
): Promise<ListOrdersResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListOrdersResponse>(`/orders${queryString}`);
  return response.data;
};

export const getOrderById = async (
  id: string,
  selectFields?: string[]
): Promise<Order> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<Order>(`/orders/${id}${queryString}`);
  return response.data;
};

export const createOrder = async (
  data: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  const response = await http.post<CreateOrderResponse>('/orders', data);
  return response.data;
};

export const updateOrder = async (
  id: string,
  data: UpdateOrderRequest
): Promise<void> => {
  await http.patch(`/orders/${id}`, data);
};

export const deleteOrder = async (id: string): Promise<void> => {
  await http.delete(`/orders/${id}`);
};
