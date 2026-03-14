/**
 * Menu service types
 * Basic types for menu listing (used in branch forms)
 * GET /menus/:id returns MenuWithCategories (menu + categories + products in one request)
 */

import type { SortConfig } from '@services/countries';
import type { Product } from '@services/products';

/**
 * Menu entity
 */
export interface Menu {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Item in category.products[] from GET /menus/:id */
export interface CategoryProductItemInMenu {
  id: string;
  productId: string;
  order?: number;
  product: Product;
}

/** Category as returned inside GET /menus/:id (with embedded products) */
export interface CategoryInMenu {
  id: string;
  menuId: string;
  name: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  products: CategoryProductItemInMenu[];
}

/** Menu with categories and products (GET /menus/:id response) */
export interface MenuWithCategories extends Menu {
  categories?: CategoryInMenu[];
}

/**
 * Request to create a menu
 */
export interface CreateMenuRequest {
  name: string;
  isActive?: boolean;
}

/**
 * Response from creating a menu
 */
export interface CreateMenuResponse {
  id: string;
}

/**
 * Request to update a menu
 */
export interface UpdateMenuRequest {
  name?: string;
  isActive?: boolean;
}

/**
 * Parameters for listing menus
 */
export interface ListMenusParams {
  pageIndex?: number;
  pageSize?: number;
  /** Busca parcial em name (recomendado) */
  term?: string;
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
