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
  BRANCHES_CREATE: '/branches/create',
  BRANCHES_DETAILS: '/branches/:id',
  BRANCHES_EDIT: '/branches/:id/edit',
  ORDERS: '/orders',
  ORDERS_CREATE: '/orders/create',
  ORDERS_DETAILS: '/orders/:id',
  ORDERS_EDIT: '/orders/:id/edit',
  MENUS: '/menus',
  MENUS_CREATE: '/menus/create',
  MENUS_DETAILS: '/menus/:id',
  MENUS_EDIT: '/menus/:id/edit',
  PRODUCTS: '/products',
  PRODUCTS_CREATE: '/products/create',
  PRODUCTS_DETAILS: '/products/:id',
  PRODUCTS_EDIT: '/products/:id/edit',
  INGREDIENTS: '/ingredients',
  STOCK: '/stock',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
