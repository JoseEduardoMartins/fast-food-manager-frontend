/**
 * City types
 * Types for cities CRUD operations
 */

/**
 * Sort configuration
 */
export interface SortConfig {
  fields: string[];
  order: ('ASC' | 'DESC')[];
}

/**
 * City entity
 */
export interface City {
  id: string;
  name: string;
  stateId: string;
}

/**
 * List cities request parameters
 */
export interface ListCitiesParams {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  stateId?: string;
  sort?: SortConfig;
  selectFields?: string[];
  ids?: number[];
  ignoredIds?: number[];
}

/**
 * List cities response
 */
export interface ListCitiesResponse {
  data: City[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Create city request
 */
export interface CreateCityRequest {
  name: string;
  stateId: string;
}

/**
 * Update city request
 */
export interface UpdateCityRequest {
  name?: string;
  stateId?: string;
}

/**
 * Create city response
 */
export interface CreateCityResponse {
  id: string;
}
