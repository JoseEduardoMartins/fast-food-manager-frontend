/**
 * Product service
 * List/get products for order items selection
 * GET /products - adjust base path if your API uses /menus/:id/products
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  Product,
  ListProductsParams,
  ListProductsResponse,
} from './products.types';

export const listProducts = async (
  params?: ListProductsParams
): Promise<ListProductsResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListProductsResponse>(
    `/products${queryString}`
  );
  return response.data;
};

export const getProductById = async (
  id: string,
  selectFields?: string[]
): Promise<Product> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<Product>(`/products/${id}${queryString}`);
  return response.data;
};
