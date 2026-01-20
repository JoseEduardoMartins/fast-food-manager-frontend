/**
 * User service
 * CRUD operations for users management
 * Based on backend API documentation
 */

import { http } from '@config';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  CreateUserResponse,
  ListUsersParams,
  ListUsersResponse,
} from './users.types';

/**
 * Lists users with optional filters and pagination
 * GET /api/users
 */
export const listUsers = async (params?: ListUsersParams): Promise<ListUsersResponse> => {
  const queryParams: Record<string, any> = {};
  
  if (params?.pageIndex !== undefined) queryParams.pageIndex = params.pageIndex;
  if (params?.pageSize !== undefined) queryParams.pageSize = params.pageSize;
  if (params?.name) queryParams.name = params.name;
  if (params?.email) queryParams.email = params.email;
  if (params?.role) queryParams.role = params.role;
  if (params?.companyId) queryParams.companyId = params.companyId;
  if (params?.branchId) queryParams.branchId = params.branchId;
  if (params?.isActive !== undefined) queryParams.isActive = params.isActive;
  if (params?.selectFields && params.selectFields.length > 0) {
    queryParams.selectFields = params.selectFields;
  }

  const response = await http.get<ListUsersResponse>('/users', { params: queryParams });
  return response.data;
};

/**
 * Gets a user by ID
 * GET /api/users/:id
 */
export const getUserById = async (
  id: string,
  selectFields?: string[]
): Promise<User> => {
  const params: Record<string, any> = {};
  if (selectFields && selectFields.length > 0) {
    params.selectFields = selectFields;
  }

  const response = await http.get<User>(`/users/${id}`, { params });
  return response.data;
};

/**
 * Creates a new user
 * POST /api/users
 * Returns: { id: string }
 */
export const createUser = async (data: CreateUserRequest): Promise<CreateUserResponse> => {
  const response = await http.post<CreateUserResponse>('/users', data);
  return response.data;
};

/**
 * Updates a user
 * PATCH /api/users/:id
 * Returns: 204 No Content
 */
export const updateUser = async (id: string, data: UpdateUserRequest): Promise<void> => {
  await http.patch(`/users/${id}`, data);
};

/**
 * Deletes a user
 * DELETE /api/users/:id
 * Returns: 204 No Content
 */
export const deleteUser = async (id: string): Promise<void> => {
  await http.delete(`/users/${id}`);
};
