/**
 * Order deliveries service
 * CRUD operations for order deliveries (delivery mode)
 * Based on backend API documentation
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  OrderDelivery,
  CreateOrderDeliveryRequest,
  UpdateOrderDeliveryRequest,
  CreateOrderDeliveryResponse,
  ListOrderDeliveriesParams,
  ListOrderDeliveriesResponse,
} from './order-deliveries.types';

export const listOrderDeliveries = async (
  params?: ListOrderDeliveriesParams
): Promise<ListOrderDeliveriesResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListOrderDeliveriesResponse>(
    `/order-deliveries${queryString}`
  );
  return response.data;
};

export const getOrderDeliveryById = async (
  id: string,
  selectFields?: string[]
): Promise<OrderDelivery> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<OrderDelivery>(
    `/order-deliveries/${id}${queryString}`
  );
  return response.data;
};

export const createOrderDelivery = async (
  data: CreateOrderDeliveryRequest
): Promise<CreateOrderDeliveryResponse> => {
  const response = await http.post<CreateOrderDeliveryResponse>(
    '/order-deliveries',
    data
  );
  return response.data;
};

export const updateOrderDelivery = async (
  id: string,
  data: UpdateOrderDeliveryRequest
): Promise<void> => {
  await http.patch(`/order-deliveries/${id}`, data);
};

export const deleteOrderDelivery = async (id: string): Promise<void> => {
  await http.delete(`/order-deliveries/${id}`);
};
