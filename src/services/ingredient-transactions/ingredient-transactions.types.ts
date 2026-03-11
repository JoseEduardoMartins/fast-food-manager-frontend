/**
 * Ingredient-transaction types (stock movements)
 * type: input (entrada) | output (saída)
 * Prices in centavos
 */

import type { SortConfig } from '@services/countries';

export type IngredientTransactionType = 'input' | 'output';

export interface IngredientTransaction {
  id: string;
  ingredientId: number;
  branchId: string;
  type: IngredientTransactionType;
  quantity: number;
  unitPrice?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListIngredientTransactionsParams {
  pageIndex?: number;
  pageSize?: number;
  ingredientId?: number;
  branchId?: string;
  type?: IngredientTransactionType;
  quantity?: number;
  selectFields?: string[];
  sort?: SortConfig;
}

export interface ListIngredientTransactionsResponse {
  data: IngredientTransaction[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateIngredientTransactionRequest {
  ingredientId: number;
  branchId: string;
  type: IngredientTransactionType;
  quantity: number;
  unitPrice?: number;
  description?: string;
}

export interface UpdateIngredientTransactionRequest {
  type?: IngredientTransactionType;
  quantity?: number;
  unitPrice?: number;
  description?: string;
}

export interface CreateIngredientTransactionResponse {
  id: string;
}
