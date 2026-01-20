/**
 * Public Route Guard
 * Redirects authenticated users away from auth pages (login, register)
 */

import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@contexts';
import { ROUTES } from '@common/constants';

/**
 * Public Route Props
 */
interface PublicRouteProps {
  children: ReactNode;
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
}

/**
 * Public Route Component
 * Wraps routes that should redirect authenticated users
 * Useful for login/register pages
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectIfAuthenticated = false,
  redirectTo = ROUTES.DASHBOARD,
}) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  // Redirect authenticated users away from auth pages
  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render public content
  return <>{children}</>;
};
