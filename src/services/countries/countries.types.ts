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
 * Sort configuration
 */
export interface SortConfig {
  fields: string[];
  order: ('ASC' | 'DESC')[];
}

/**
 * List countries request parameters
 */
export interface ListCountriesParams {
  pageIndex?: number;
  pageSize?: number;
  /** Busca parcial em name e shortName (recomendado) */
  term?: string;
  name?: string;
  shortName?: string;
  phoneCode?: string;
  sort?: SortConfig;
  selectFields?: string[];
  ids?: number[];
  ignoredIds?: number[];
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
