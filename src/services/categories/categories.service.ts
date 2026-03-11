/**
 * Category service
 * CRUD for categories (menuId, name, order, isActive)
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  Category,
  ListCategoriesParams,
  ListCategoriesResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  UpdateCategoryRequest,
} from './categories.types';

export const listCategories = async (
  params?: ListCategoriesParams
): Promise<ListCategoriesResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListCategoriesResponse>(`/categories${queryString}`);
  return response.data;
};

export const getCategoryById = async (
  id: string,
  selectFields?: string[]
): Promise<Category> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<Category>(`/categories/${id}${queryString}`);
  return response.data;
};

export const createCategory = async (
  data: CreateCategoryRequest
): Promise<CreateCategoryResponse> => {
  const response = await http.post<CreateCategoryResponse>('/categories', data);
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: UpdateCategoryRequest
): Promise<void> => {
  await http.patch(`/categories/${id}`, data);
};

export const deleteCategory = async (id: string): Promise<void> => {
  await http.delete(`/categories/${id}`);
};
