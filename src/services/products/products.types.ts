/**
 * Product service types
 * Minimal types for product listing (used in order items)
 * Adjust to match your backend /products or /menus/:id/products API
 */

import type { SortConfig } from '@services/countries';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  menuId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListProductsParams {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  menuId?: string;
  isActive?: boolean;
  selectFields?: string[];
  sort?: SortConfig;
}

export interface ListProductsResponse {
  data: Product[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}
