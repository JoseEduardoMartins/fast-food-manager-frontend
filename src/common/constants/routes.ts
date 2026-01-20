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
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
