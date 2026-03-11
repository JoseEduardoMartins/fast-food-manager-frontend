/**
 * Category service types
 * Categories belong to a menu (menuId)
 */

import type { SortConfig } from '@services/countries';

export interface Category {
  id: string;
  menuId: string;
  name: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListCategoriesParams {
  pageIndex?: number;
  pageSize?: number;
  menuId?: string;
  name?: string;
  order?: number;
  isActive?: boolean;
  selectFields?: string[];
  sort?: SortConfig;
}

export interface ListCategoriesResponse {
  data: Category[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateCategoryRequest {
  menuId: string;
  name: string;
  order: number;
  isActive?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  order?: number;
  isActive?: boolean;
}

export interface CreateCategoryResponse {
  id: string;
}
