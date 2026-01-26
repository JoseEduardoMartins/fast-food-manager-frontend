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
 * Request to create a company
 */
export interface CreateCompanyRequest {
  name: string;
  cnpj: string;
  addressId: string;
  phone?: string;
  isActive?: boolean;
}

/**
 * Response from creating a company
 */
export interface CreateCompanyResponse {
  id: string;
}

/**
 * Request to update a company
 */
export interface UpdateCompanyRequest {
  name?: string;
  cnpj?: string;
  addressId?: string;
  phone?: string;
  isActive?: boolean;
}
