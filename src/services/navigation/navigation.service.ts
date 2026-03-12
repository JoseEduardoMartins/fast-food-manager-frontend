import { http } from '@config';
import type { GetNavigationResponse, NavigationItem } from './navigation.types';

/**
 * Fetch navigation menu/submenu items from backend.
 * The backend should return items already filtered by access profile.
 */
export const getNavigation = async (): Promise<NavigationItem[]> => {
  // Endpoint name chosen to avoid conflict with "menus" module
  const response = await http.get<GetNavigationResponse>('/navigation');
  return response.data.items;
};

