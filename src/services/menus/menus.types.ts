/**
 * Menu service types
 * Basic types for menu listing (used in branch forms)
 */

import type { SortConfig } from '@services/countries';

/**
 * Menu entity
 */
export interface Menu {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Parameters for listing menus
 */
export interface ListMenusParams {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  isActive?: boolean;
  selectFields?: string[];
  ids?: number[];
  ignoredIds?: number[];
  sort?: SortConfig;
}

/**
 * Response from listing menus
 */
export interface ListMenusResponse {
  data: Menu[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}
