/**
 * Route constants for the application
 * Centralized route paths for consistency and easy updates
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  PLATFORM: '/platform',
  CONTACT: '/contact',
  CAREERS: '/careers',

  // Authentication routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Protected routes (require authentication)
  DASHBOARD: '/dashboard',
  USERS: '/users',
  COMPANIES: '/companies',
  BRANCHES: '/branches',
  ORDERS: '/orders',
  MENUS: '/menus',
  PRODUCTS: '/products',
  INGREDIENTS: '/ingredients',
  STOCK: '/stock',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
