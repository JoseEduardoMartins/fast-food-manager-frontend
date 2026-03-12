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
  /** Optional array of roles allowed (used when permissions are not available) */
  allowedRoles?: UserRole[];
  /** Optional array of permissions (any one grants access). Takes precedence over allowedRoles when user has permissions. */
  allowedPermissions?: string[];
}

/**
 * Protected Route Component
 * Wraps routes that require authentication and optionally checks user role
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, allowedPermissions }) => {
  const { user, isAuthenticated, loading, hasPermission, permissions } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Permission-based: if we have permissions from backend and allowedPermissions is set, check them
  if (allowedPermissions && allowedPermissions.length > 0) {
    const hasAny = permissions.length > 0 && allowedPermissions.some((p) => hasPermission(p));
    if (!hasAny) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
    return <>{children}</>;
  }

  // Role-based fallback (when permissions not used for this route)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
