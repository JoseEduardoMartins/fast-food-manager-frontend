/**
 * Product service
 * CRUD operations for products - price in centavos
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  Product,
  ListProductsParams,
  ListProductsResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
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

/**
 * Creates a new product
 * POST /products - price in centavos
 */
export const createProduct = async (
  data: CreateProductRequest
): Promise<CreateProductResponse> => {
  const response = await http.post<CreateProductResponse>('/products', data);
  return response.data;
};

/**
 * Updates a product
 * PATCH /products/:id
 */
export const updateProduct = async (
  id: string,
  data: UpdateProductRequest
): Promise<void> => {
  await http.patch(`/products/${id}`, data);
};

/**
 * Deletes a product
 * DELETE /products/:id - 409 if in use (order items, etc.)
 */
export const deleteProduct = async (id: string): Promise<void> => {
  await http.delete(`/products/${id}`);
};
