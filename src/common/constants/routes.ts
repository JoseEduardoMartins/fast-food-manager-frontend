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
  USERS_CREATE: '/users/create',
  USERS_DETAILS: '/users/:id',
  USERS_EDIT: '/users/:id/edit',
  COMPANIES: '/companies',
  COMPANIES_CREATE: '/companies/create',
  COMPANIES_DETAILS: '/companies/:id',
  COMPANIES_EDIT: '/companies/:id/edit',
  BRANCHES: '/branches',
  ORDERS: '/orders',
  MENUS: '/menus',
  PRODUCTS: '/products',
  INGREDIENTS: '/ingredients',
  STOCK: '/stock',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
