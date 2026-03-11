/**
 * Ingredient service types
 * CRUD for ingredients (name, description, isActive)
 */

import type { SortConfig } from '@services/countries';

export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListIngredientsParams {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  isActive?: boolean;
  selectFields?: string[];
  ids?: number[];
  ignoredIds?: number[];
  sort?: SortConfig;
}

export interface ListIngredientsResponse {
  data: Ingredient[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateIngredientRequest {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateIngredientRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateIngredientResponse {
  id: string;
}
