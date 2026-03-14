/**
 * Product service types
 * Based on backend API documentation - price in centavos
 */

import type { SortConfig } from '@services/countries';

export interface ProductIngredient {
  id: string;
  ingredientId: number;
  units: number;
  quantityPerUnit: number;
  ingredient?: { id: number; name: string; unit: string };
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  ingredients?: ProductIngredient[];
}

export interface CreateProductIngredientInput {
  ingredientId: number;
  units: number;
  quantityPerUnit: number;
}

export interface UpdateProductIngredientInput {
  id?: string;
  ingredientId: number;
  units: number;
  quantityPerUnit: number;
}

export interface ListProductsParams {
  pageIndex?: number;
  pageSize?: number;
  /** Busca parcial em name e description (recomendado) */
  term?: string;
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
  ingredients?: CreateProductIngredientInput[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  ingredients?: UpdateProductIngredientInput[];
}

export interface CreateProductResponse {
  id: string;
}
