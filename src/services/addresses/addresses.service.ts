/**
 * Address service
 * CRUD operations for addresses management
 */

import { http } from '@config';
import type {
  Address,
  CreateAddressRequest,
  CreateAddressResponse,
  UpdateAddressRequest,
} from './addresses.types';

/**
 * Gets an address by ID
 * GET /addresses/:id
 */
export const getAddressById = async (id: string): Promise<Address> => {
  const response = await http.get<Address>(`/addresses/${id}`);
  return response.data;
};

/**
 * Creates a new address
 * POST /addresses
 * Returns: { id: string }
 */
export const createAddress = async (data: CreateAddressRequest): Promise<CreateAddressResponse> => {
  const response = await http.post<CreateAddressResponse>('/addresses', data);
  return response.data;
};

/**
 * Updates an address
 * PATCH /addresses/:id
 * Returns: 204 No Content
 */
export const updateAddress = async (id: string, data: UpdateAddressRequest): Promise<void> => {
  await http.patch(`/addresses/${id}`, data);
};

/**
 * Deletes an address
 * DELETE /addresses/:id
 * Returns: 204 No Content
 */
export const deleteAddress = async (id: string): Promise<void> => {
  await http.delete(`/addresses/${id}`);
};
