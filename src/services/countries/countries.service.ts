/**
 * Country service
 * CRUD operations for countries management
 * Based on backend API documentation
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  Country,
  CreateCountryRequest,
  UpdateCountryRequest,
  CreateCountryResponse,
  ListCountriesParams,
  ListCountriesResponse,
} from './countries.types';

/**
 * Lists countries with optional filters and pagination
 * GET /api/countries
 */
export const listCountries = async (params?: ListCountriesParams): Promise<ListCountriesResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListCountriesResponse>(`/countries${queryString}`);
  return response.data;
};

/**
 * Gets a country by ID
 * GET /api/countries/:id
 */
export const getCountryById = async (
  id: string,
  selectFields?: string[]
): Promise<Country> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<Country>(`/countries/${id}${queryString}`);
  return response.data;
};

/**
 * Creates a new country
 * POST /api/countries
 * Returns: { id: string }
 */
export const createCountry = async (data: CreateCountryRequest): Promise<CreateCountryResponse> => {
  const response = await http.post<CreateCountryResponse>('/countries', data);
  return response.data;
};

/**
 * Updates a country
 * PATCH /api/countries/:id
 * Returns: 204 No Content
 */
export const updateCountry = async (id: string, data: UpdateCountryRequest): Promise<void> => {
  await http.patch(`/countries/${id}`, data);
};

/**
 * Deletes a country
 * DELETE /api/countries/:id
 * Returns: 204 No Content
 */
export const deleteCountry = async (id: string): Promise<void> => {
  await http.delete(`/countries/${id}`);
};
