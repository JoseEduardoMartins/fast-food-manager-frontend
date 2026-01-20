/**
 * Protected Route Guard
 * Redirects unauthenticated users to login page
 */

import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@contexts';
import { ROUTES } from '@common/constants';

/**
 * Protected Route Props
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protected Route Component
 * Wraps routes that require authentication
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Render protected content
  return <>{children}</>;
};
