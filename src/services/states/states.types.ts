/**
 * State types
 * Types for states CRUD operations
 */

/**
 * Sort configuration
 */
export interface SortConfig {
  fields: string[];
  order: ('ASC' | 'DESC')[];
}

/**
 * State entity
 */
export interface State {
  id: string;
  name: string;
  shortName: string;
  countryId: string;
}

/**
 * List states request parameters
 */
export interface ListStatesParams {
  pageIndex?: number;
  pageSize?: number;
  /** Busca parcial em name e shortName (recomendado) */
  term?: string;
  name?: string;
  shortName?: string;
  countryId?: string;
  sort?: SortConfig;
  selectFields?: string[];
  ids?: number[];
  ignoredIds?: number[];
}

/**
 * List states response
 */
export interface ListStatesResponse {
  data: State[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Create state request
 */
export interface CreateStateRequest {
  name: string;
  shortName: string;
  countryId: string;
}

/**
 * Update state request
 */
export interface UpdateStateRequest {
  name?: string;
  shortName?: string;
  countryId?: string;
}

/**
 * Create state response
 */
export interface CreateStateResponse {
  id: string;
}
