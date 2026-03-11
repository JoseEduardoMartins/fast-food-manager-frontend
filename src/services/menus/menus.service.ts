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
  CreateMenuRequest,
  CreateMenuResponse,
  UpdateMenuRequest,
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

/**
 * Creates a new menu
 * POST /menus
 * Returns: { id: string }
 */
export const createMenu = async (
  data: CreateMenuRequest
): Promise<CreateMenuResponse> => {
  const response = await http.post<CreateMenuResponse>('/menus', data);
  return response.data;
};

/**
 * Updates a menu
 * PATCH /menus/:id
 * Returns: 204 No Content
 */
export const updateMenu = async (
  id: string,
  data: UpdateMenuRequest
): Promise<void> => {
  await http.patch(`/menus/${id}`, data);
};

/**
 * Deletes a menu
 * DELETE /menus/:id
 * Returns: 204 No Content
 * 409 if menu is linked to branches
 */
export const deleteMenu = async (id: string): Promise<void> => {
  await http.delete(`/menus/${id}`);
};
