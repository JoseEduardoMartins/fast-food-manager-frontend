/**
 * Order items service
 * CRUD operations for order items
 * Based on backend API documentation
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  OrderItem,
  CreateOrderItemRequest,
  UpdateOrderItemRequest,
  CreateOrderItemResponse,
  ListOrderItemsParams,
  ListOrderItemsResponse,
} from './order-items.types';

export const listOrderItems = async (
  params?: ListOrderItemsParams
): Promise<ListOrderItemsResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListOrderItemsResponse>(
    `/order-items${queryString}`
  );
  return response.data;
};

export const getOrderItemById = async (
  id: string,
  selectFields?: string[]
): Promise<OrderItem> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<OrderItem>(
    `/order-items/${id}${queryString}`
  );
  return response.data;
};

export const createOrderItem = async (
  data: CreateOrderItemRequest
): Promise<CreateOrderItemResponse> => {
  const response = await http.post<CreateOrderItemResponse>(
    '/order-items',
    data
  );
  return response.data;
};

export const updateOrderItem = async (
  id: string,
  data: UpdateOrderItemRequest
): Promise<void> => {
  await http.patch(`/order-items/${id}`, data);
};

export const deleteOrderItem = async (id: string): Promise<void> => {
  await http.delete(`/order-items/${id}`);
};
