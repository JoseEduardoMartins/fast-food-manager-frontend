/**
 * Branch service
 * CRUD operations for branches management
 * Based on backend API documentation
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  Branch,
  CreateBranchRequest,
  UpdateBranchRequest,
  CreateBranchResponse,
  ListBranchesParams,
  ListBranchesResponse,
} from './branches.types';

/**
 * Lists branches with optional filters and pagination
 * GET /branches
 */
export const listBranches = async (params?: ListBranchesParams): Promise<ListBranchesResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListBranchesResponse>(`/branches${queryString}`);
  return response.data;
};

/**
 * Gets a branch by ID
 * GET /branches/:id
 */
export const getBranchById = async (
  id: string,
  selectFields?: string[]
): Promise<Branch> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<Branch>(`/branches/${id}${queryString}`);
  return response.data;
};

/**
 * Creates a new branch
 * POST /branches
 * Returns: { id: string }
 */
export const createBranch = async (data: CreateBranchRequest): Promise<CreateBranchResponse> => {
  const response = await http.post<CreateBranchResponse>('/branches', data);
  return response.data;
};

/**
 * Updates a branch
 * PATCH /branches/:id
 * Returns: 204 No Content
 */
export const updateBranch = async (id: string, data: UpdateBranchRequest): Promise<void> => {
  await http.patch(`/branches/${id}`, data);
};

/**
 * Deletes a branch
 * DELETE /branches/:id
 * Returns: 204 No Content
 */
export const deleteBranch = async (id: string): Promise<void> => {
  await http.delete(`/branches/${id}`);
};
