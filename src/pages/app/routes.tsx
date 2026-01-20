import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@components/guards';
import Dashboard from './Dashboard';
import Users from './Users';
import { ROUTES } from '@common/constants';

/**
 * Protected routes - require authentication
 * These routes are wrapped with ProtectedRoute guard
 */
export const AppRoutes = (
  <>
    <Route
      path={ROUTES.DASHBOARD}
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.USERS}
      element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      }
    />
  </>
);
