/**
 * Branch-ingredients service (stock per branch)
 * Prices in centavos
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  BranchIngredient,
  ListBranchIngredientsParams,
  ListBranchIngredientsResponse,
  CreateBranchIngredientRequest,
  CreateBranchIngredientResponse,
  UpdateBranchIngredientRequest,
} from './branch-ingredients.types';

export const listBranchIngredients = async (
  params?: ListBranchIngredientsParams
): Promise<ListBranchIngredientsResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListBranchIngredientsResponse>(
    `/branch-ingredients${queryString}`
  );
  return response.data;
};

export const getBranchIngredientById = async (
  id: string,
  selectFields?: string[]
): Promise<BranchIngredient> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<BranchIngredient>(
    `/branch-ingredients/${id}${queryString}`
  );
  return response.data;
};

export const createBranchIngredient = async (
  data: CreateBranchIngredientRequest
): Promise<CreateBranchIngredientResponse> => {
  const response = await http.post<CreateBranchIngredientResponse>(
    '/branch-ingredients',
    data
  );
  return response.data;
};

export const updateBranchIngredient = async (
  id: string,
  data: UpdateBranchIngredientRequest
): Promise<void> => {
  await http.patch(`/branch-ingredients/${id}`, data);
};

export const deleteBranchIngredient = async (id: string): Promise<void> => {
  await http.delete(`/branch-ingredients/${id}`);
};
