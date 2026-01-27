/**
 * Branch service types
 * Based on backend API documentation
 */

import type { SortConfig } from '@services/countries';

/**
 * Branch entity
 */
export interface Branch {
  id: string;
  name: string;
  companyId: string;
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
  companyId?: string;
  menuId?: string;
  addressId?: string;
  phone?: string;
  isActive?: boolean;
}
