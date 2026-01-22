/**
 * Protected Route Guard
 * Redirects unauthenticated users to login page
 * Optionally checks user role for authorization
 */

import React from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@contexts';
import { ROUTES } from '@common/constants';
import type { UserRole } from '@services/auth';

/**
 * Protected Route Props
 */
interface ProtectedRouteProps {
  children: ReactNode;
  /** Optional array of roles allowed to access this route */
  allowedRoles?: UserRole[];
}

/**
 * Protected Route Component
 * Wraps routes that require authentication and optionally checks user role
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

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

  // Check role authorization if allowedRoles is provided
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Render protected content
  return <>{children}</>;
};
