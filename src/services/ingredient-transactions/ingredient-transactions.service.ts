/**
 * Ingredient-transactions service (stock in/out - updates stock automatically)
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  IngredientTransaction,
  ListIngredientTransactionsParams,
  ListIngredientTransactionsResponse,
  CreateIngredientTransactionRequest,
  CreateIngredientTransactionResponse,
  UpdateIngredientTransactionRequest,
} from './ingredient-transactions.types';

export const listIngredientTransactions = async (
  params?: ListIngredientTransactionsParams
): Promise<ListIngredientTransactionsResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListIngredientTransactionsResponse>(
    `/ingredient-transactions${queryString}`
  );
  return response.data;
};

export const getIngredientTransactionById = async (
  id: string,
  selectFields?: string[]
): Promise<IngredientTransaction> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<IngredientTransaction>(
    `/ingredient-transactions/${id}${queryString}`
  );
  return response.data;
};

export const createIngredientTransaction = async (
  data: CreateIngredientTransactionRequest
): Promise<CreateIngredientTransactionResponse> => {
  const response = await http.post<CreateIngredientTransactionResponse>(
    '/ingredient-transactions',
    data
  );
  return response.data;
};

export const updateIngredientTransaction = async (
  id: string,
  data: UpdateIngredientTransactionRequest
): Promise<void> => {
  await http.patch(`/ingredient-transactions/${id}`, data);
};

export const deleteIngredientTransaction = async (id: string): Promise<void> => {
  await http.delete(`/ingredient-transactions/${id}`);
};
