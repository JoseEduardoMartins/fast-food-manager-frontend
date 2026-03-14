/**
 * Company service types
 * Based on backend API documentation
 */

import type { SortConfig } from '@services/countries';

/**
 * Company entity
 */
export interface Company {
  id: string;
  name: string;
  cnpj: string;
  addressId: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Parameters for listing companies
 */
export interface ListCompaniesParams {
  pageIndex?: number;
  pageSize?: number;
  /** Busca parcial em name (recomendado) */
  term?: string;
  name?: string;
  cnpj?: string;
  addressId?: string;
  isActive?: boolean;
  selectFields?: string[];
  ids?: number[];
  ignoredIds?: number[];
  sort?: SortConfig;
}

/**
 * Response from listing companies
 */
export interface ListCompaniesResponse {
  data: Company[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Address data for company creation/update
 */
export interface CompanyAddressInput {
  street: string;
  number?: string;
  complement?: string;
  zipcode?: string;
  countryId: string;
  stateId: string;
  cityId: string;
}

/**
 * Request to create a company
 * Can use either addressId (existing address) or address (create inline)
 */
export interface CreateCompanyRequest {
  name: string;
  cnpj: string;
  addressId?: string; // Required if address is not provided
  address?: CompanyAddressInput; // Required if addressId is not provided
  phone?: string;
  // isActive is not available in creation - always true
}

/**
 * Response from creating a company
 */
export interface CreateCompanyResponse {
  id: string;
}

/**
 * Request to update a company
 * Can use addressId (to change to existing address) or address (to update/create inline)
 */
export interface UpdateCompanyRequest {
  name?: string;
  cnpj?: string;
  addressId?: string; // To change to an existing address
  address?: Partial<CompanyAddressInput>; // To update/create address inline (all fields optional)
  phone?: string;
  isActive?: boolean;
}
