/**
 * Category-Product service types
 * Links category to product with order
 */

import type { SortConfig } from '@services/countries';

export interface CategoryProduct {
  id: string;
  categoryId: string;
  productId: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListCategoryProductsParams {
  pageIndex?: number;
  pageSize?: number;
  categoryId?: string;
  productId?: string;
  order?: number;
  selectFields?: string[];
  sort?: SortConfig;
}

export interface ListCategoryProductsResponse {
  data: CategoryProduct[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateCategoryProductRequest {
  categoryId: string;
  productId: string;
  order?: number;
}

export interface UpdateCategoryProductRequest {
  order?: number;
}

export interface CreateCategoryProductResponse {
  id: string;
}
