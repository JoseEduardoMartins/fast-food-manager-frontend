/**
 * Menu service
 * Basic CRUD operations for menus management
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  Menu,
  ListMenusParams,
  ListMenusResponse,
} from './menus.types';

/**
 * Lists menus with optional filters and pagination
 * GET /menus
 */
export const listMenus = async (params?: ListMenusParams): Promise<ListMenusResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListMenusResponse>(`/menus${queryString}`);
  return response.data;
};

/**
 * Gets a menu by ID
 * GET /menus/:id
 */
export const getMenuById = async (
  id: string,
  selectFields?: string[]
): Promise<Menu> => {
  const queryString = buildQueryParams({ selectFields });
  const response = await http.get<Menu>(`/menus/${id}${queryString}`);
  return response.data;
};
