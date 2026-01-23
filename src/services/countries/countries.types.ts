/**
 * Country types
 * Types for countries CRUD operations
 */

/**
 * Country entity
 */
export interface Country {
  id: string;
  name: string;
  shortName: string;
  phoneCode: string;
}

/**
 * List countries request parameters
 */
export interface ListCountriesParams {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  shortName?: string;
  phoneCode?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  selectFields?: string[];
}

/**
 * List countries response
 */
export interface ListCountriesResponse {
  data: Country[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Create country request
 */
export interface CreateCountryRequest {
  name: string;
  shortName: string;
  phoneCode: string;
}

/**
 * Update country request
 */
export interface UpdateCountryRequest {
  name?: string;
  shortName?: string;
  phoneCode?: string;
}

/**
 * Create country response
 */
export interface CreateCountryResponse {
  id: string;
}
