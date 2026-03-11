/**
 * Ingredient service types
 * CRUD for ingredients (name, description, unit) - ID is numeric
 */

import type { SortConfig } from '@services/countries';

export type IngredientUnit = 'g' | 'kg' | 'ml' | 'L' | 'un';

export interface Ingredient {
  id: number;
  name: string;
  description?: string;
  unit: IngredientUnit;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListIngredientsParams {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  description?: string;
  unit?: IngredientUnit;
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
  unit: IngredientUnit;
}

export interface UpdateIngredientRequest {
  name?: string;
  description?: string;
  unit?: IngredientUnit;
}

export interface CreateIngredientResponse {
  id: number;
}
