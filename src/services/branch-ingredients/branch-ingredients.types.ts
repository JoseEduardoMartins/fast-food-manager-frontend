/**
 * Branch-ingredient (stock per branch) types
 * Prices in centavos
 */

import type { SortConfig } from '@services/countries';

export interface BranchIngredient {
  id: string;
  branchId: string;
  ingredientId: string;
  stockQuantity: number;
  stockMinQuantity: number;
  purchasePrice: number;
  salePrice?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListBranchIngredientsParams {
  pageIndex?: number;
  pageSize?: number;
  branchId?: string;
  ingredientId?: string;
  stockQuantity?: number;
  purchasePrice?: number;
  selectFields?: string[];
  sort?: SortConfig;
}

export interface ListBranchIngredientsResponse {
  data: BranchIngredient[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateBranchIngredientRequest {
  branchId: string;
  ingredientId: string;
  stockQuantity: number;
  stockMinQuantity: number;
  purchasePrice: number;
  salePrice?: number;
}

export interface UpdateBranchIngredientRequest {
  stockQuantity?: number;
  stockMinQuantity?: number;
  purchasePrice?: number;
  salePrice?: number;
}

export interface CreateBranchIngredientResponse {
  id: string;
}
