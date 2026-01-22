import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@components/guards';
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
 * Some routes also check user roles for authorization
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
        <ProtectedRoute allowedRoles={['admin']}>
          <Users />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.COMPANIES}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner']}>
          <Companies />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.BRANCHES}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner']}>
          <Branches />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.ORDERS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'attendant', 'delivery']}>
          <Orders />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.MENUS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'attendant']}>
          <Menus />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.PRODUCTS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook', 'attendant']}>
          <Products />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.INGREDIENTS}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook']}>
          <Ingredients />
        </ProtectedRoute>
      }
    />
    <Route
      path={ROUTES.STOCK}
      element={
        <ProtectedRoute allowedRoles={['admin', 'owner', 'manager', 'cook']}>
          <Stock />
        </ProtectedRoute>
      }
    />
  </>
);
