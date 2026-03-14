/**
 * Branch service types
 * Based on backend API documentation
 */

import type { SortConfig } from '@services/countries';
import type { Country, State, City } from '@services/users';

/**
 * Company entity with full details (returned in branch listing)
 */
export interface CompanyWithDetails {
  id: string;
  name: string;
  cnpj: string;
  addressId: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  address?: {
    id: string;
    street: string;
    number?: string;
    complement?: string;
    zipcode?: string;
    countryId: string;
    stateId: string;
    cityId: string;
    country?: Country;
    state?: State;
    city?: City;
  };
}

/**
 * Branch entity
 * Note: When listing/b fetching branches, the backend automatically returns
 * the full company object with address and relationships via leftJoin
 */
export interface Branch {
  id: string;
  name: string;
  nickname: string;
  companyId: string;
  company?: CompanyWithDetails; // Automatically populated by backend via leftJoin
  menuId: string;
  addressId: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Parameters for listing branches
 */
export interface ListBranchesParams {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  nickname?: string;
  companyId?: string;
  menuId?: string;
  addressId?: string;
  isActive?: boolean;
  selectFields?: string[];
  ids?: number[];
  ignoredIds?: number[];
  sort?: SortConfig;
}

/**
 * Response from listing branches
 */
export interface ListBranchesResponse {
  data: Branch[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Request to create a branch
 */
export interface CreateBranchRequest {
  name: string;
  nickname: string;
  companyId: string;
  menuId: string;
  addressId: string;
  phone?: string;
  // isActive is not available in creation - always true
}

/**
 * Response from creating a branch
 */
export interface CreateBranchResponse {
  id: string;
}

/**
 * Request to update a branch
 */
export interface UpdateBranchRequest {
  name?: string;
  nickname?: string;
  companyId?: string;
  menuId?: string;
  addressId?: string;
  phone?: string;
  isActive?: boolean;
}
