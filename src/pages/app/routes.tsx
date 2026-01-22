import { Route } from 'react-router-dom';
import { ProtectedRoute, RoleGuard } from '@components/guards';
import Dashboard from './Dashboard';
import Users from './Users';
import Companies from './Companies';
import Branches from './Branches';
import Orders from './Orders';
import Menus from './Menus';
import Products from './Products';
import Ingredients from './Ingredients';
import Stock from './Stock';
import { ROUTES } from '@common/constants';

/**
 * Protected routes - require authentication
 * These routes are wrapped with ProtectedRoute guard
 * Some routes also have RoleGuard for specific user roles
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
          <RoleGuard allowedRoles={['admin']}>
            <Users />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.COMPANIES}
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['admin', 'owner']}>
            <Companies />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.BRANCHES}
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['admin', 'owner']}>
            <Branches />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.ORDERS}
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['admin', 'owner', 'manager', 'attendant', 'delivery']}>
            <Orders />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.MENUS}
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['admin', 'owner', 'manager', 'attendant']}>
            <Menus />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.PRODUCTS}
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['admin', 'owner', 'manager', 'cook', 'attendant']}>
            <Products />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.INGREDIENTS}
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['admin', 'owner', 'manager', 'cook']}>
            <Ingredients />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.STOCK}
      element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={['admin', 'owner', 'manager', 'cook']}>
            <Stock />
          </RoleGuard>
        </ProtectedRoute>
      }
    />
  </>
);
