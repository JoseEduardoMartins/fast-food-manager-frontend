/**
 * City service
 * CRUD operations for cities management
 * Based on backend API documentation
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  City,
  CreateCityRequest,
  UpdateCityRequest,
  CreateCityResponse,
  ListCitiesParams,
  ListCitiesResponse,
} from './cities.types';

/**
 * Lists cities with optional filters and pagination
 * GET /api/cities
 */
export const listCities = async (params?: ListCitiesParams): Promise<ListCitiesResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListCitiesResponse>(`/cities${queryString}`);
  return response.data;
};

/**
 * Gets a city by ID
 * GET /api/cities/:id
 */
export const getCityById = async (
  id: string,
  selectFields?: string[]
): Promise<City> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<City>(`/cities/${id}${queryString}`);
  return response.data;
};

/**
 * Creates a new city
 * POST /api/cities
 * Returns: { id: string }
 */
export const createCity = async (data: CreateCityRequest): Promise<CreateCityResponse> => {
  const response = await http.post<CreateCityResponse>('/cities', data);
  return response.data;
};

/**
 * Updates a city
 * PATCH /api/cities/:id
 * Returns: 204 No Content
 */
export const updateCity = async (id: string, data: UpdateCityRequest): Promise<void> => {
  await http.patch(`/cities/${id}`, data);
};

/**
 * Deletes a city
 * DELETE /api/cities/:id
 * Returns: 204 No Content
 */
export const deleteCity = async (id: string): Promise<void> => {
  await http.delete(`/cities/${id}`);
};
