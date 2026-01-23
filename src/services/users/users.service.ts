/**
 * User service
 * CRUD operations for users management
 * Based on backend API documentation
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  CreateUserResponse,
  ListUsersParams,
  ListUsersResponse,
  AddUserAddressRequest,
  UpdateUserAddressRequest,
  AddUserAddressResponse,
} from './users.types';

/**
 * Lists users with optional filters and pagination
 * GET /api/users
 */
export const listUsers = async (params?: ListUsersParams): Promise<ListUsersResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListUsersResponse>(`/users${queryString}`);
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
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<User>(`/users/${id}${queryString}`);
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

/**
 * Adds an address to a user
 * POST /api/users/:id/addresses
 * Returns: { id: string }
 */
export const addUserAddress = async (
  userId: string,
  data: AddUserAddressRequest
): Promise<AddUserAddressResponse> => {
  const response = await http.post<AddUserAddressResponse>(`/users/${userId}/addresses`, data);
  return response.data;
};

/**
 * Updates a user address
 * PATCH /api/users/:id/addresses/:addressId
 * Returns: 204 No Content
 */
export const updateUserAddress = async (
  userId: string,
  addressId: string,
  data: UpdateUserAddressRequest
): Promise<void> => {
  await http.patch(`/users/${userId}/addresses/${addressId}`, data);
};

/**
 * Removes an address from a user
 * DELETE /api/users/:id/addresses/:addressId
 * Returns: 204 No Content
 */
export const removeUserAddress = async (userId: string, addressId: string): Promise<void> => {
  await http.delete(`/users/${userId}/addresses/${addressId}`);
};
