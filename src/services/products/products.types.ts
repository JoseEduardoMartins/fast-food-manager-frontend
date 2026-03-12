/**
 * Product service types
 * Based on backend API documentation - price in centavos
 */

import type { SortConfig } from '@services/countries';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListProductsParams {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  price?: number;
  isActive?: boolean;
  selectFields?: string[];
  ids?: number[];
  ignoredIds?: number[];
  sort?: SortConfig;
}

export interface ListProductsResponse {
  data: Product[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  isActive?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
}

export interface CreateProductResponse {
  id: string;
}
