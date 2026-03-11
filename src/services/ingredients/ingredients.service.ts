/**
 * Ingredient service
 * CRUD operations for ingredients
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  Ingredient,
  ListIngredientsParams,
  ListIngredientsResponse,
  CreateIngredientRequest,
  CreateIngredientResponse,
  UpdateIngredientRequest,
} from './ingredients.types';

export const listIngredients = async (
  params?: ListIngredientsParams
): Promise<ListIngredientsResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListIngredientsResponse>(
    `/ingredients${queryString}`
  );
  return response.data;
};

export const getIngredientById = async (
  id: string,
  selectFields?: string[]
): Promise<Ingredient> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<Ingredient>(
    `/ingredients/${id}${queryString}`
  );
  return response.data;
};

export const createIngredient = async (
  data: CreateIngredientRequest
): Promise<CreateIngredientResponse> => {
  const response = await http.post<CreateIngredientResponse>(
    '/ingredients',
    data
  );
  return response.data;
};

export const updateIngredient = async (
  id: string,
  data: UpdateIngredientRequest
): Promise<void> => {
  await http.patch(`/ingredients/${id}`, data);
};

export const deleteIngredient = async (id: string): Promise<void> => {
  await http.delete(`/ingredients/${id}`);
};
