/**
 * State service
 * CRUD operations for states management
 * Based on backend API documentation
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  State,
  CreateStateRequest,
  UpdateStateRequest,
  CreateStateResponse,
  ListStatesParams,
  ListStatesResponse,
} from './states.types';

/**
 * Lists states with optional filters and pagination
 * GET /api/states
 */
export const listStates = async (params?: ListStatesParams): Promise<ListStatesResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListStatesResponse>(`/states${queryString}`);
  return response.data;
};

/**
 * Gets a state by ID
 * GET /api/states/:id
 */
export const getStateById = async (
  id: string,
  selectFields?: string[]
): Promise<State> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<State>(`/states/${id}${queryString}`);
  return response.data;
};

/**
 * Creates a new state
 * POST /api/states
 * Returns: { id: string }
 */
export const createState = async (data: CreateStateRequest): Promise<CreateStateResponse> => {
  const response = await http.post<CreateStateResponse>('/states', data);
  return response.data;
};

/**
 * Updates a state
 * PATCH /api/states/:id
 * Returns: 204 No Content
 */
export const updateState = async (id: string, data: UpdateStateRequest): Promise<void> => {
  await http.patch(`/states/${id}`, data);
};

/**
 * Deletes a state
 * DELETE /api/states/:id
 * Returns: 204 No Content
 */
export const deleteState = async (id: string): Promise<void> => {
  await http.delete(`/states/${id}`);
};
