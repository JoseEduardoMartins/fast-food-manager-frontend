/**
 * Category-Product service
 * CRUD for category-product links (categoryId, productId, order)
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  CategoryProduct,
  ListCategoryProductsParams,
  ListCategoryProductsResponse,
  CreateCategoryProductRequest,
  CreateCategoryProductResponse,
  UpdateCategoryProductRequest,
} from './category-products.types';

export const listCategoryProducts = async (
  params?: ListCategoryProductsParams
): Promise<ListCategoryProductsResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListCategoryProductsResponse>(
    `/category-products${queryString}`
  );
  return response.data;
};

export const getCategoryProductById = async (
  id: string,
  selectFields?: string[]
): Promise<CategoryProduct> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<CategoryProduct>(
    `/category-products/${id}${queryString}`
  );
  return response.data;
};

export const createCategoryProduct = async (
  data: CreateCategoryProductRequest
): Promise<CreateCategoryProductResponse> => {
  const response = await http.post<CreateCategoryProductResponse>(
    '/category-products',
    data
  );
  return response.data;
};

export const updateCategoryProduct = async (
  id: string,
  data: UpdateCategoryProductRequest
): Promise<void> => {
  await http.patch(`/category-products/${id}`, data);
};

export const deleteCategoryProduct = async (id: string): Promise<void> => {
  await http.delete(`/category-products/${id}`);
};
