import { Route } from 'react-router-dom';
import { PublicRoute } from '@components/guards';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
import Register from './Register';
import { ROUTES } from '@common/constants';

/**
 * Authentication routes - login, registration, password recovery
 * These routes redirect authenticated users to dashboard
 */
export const AuthRoutes = (
  <>
    <Route
      path={ROUTES.LOGIN}
      element={
        <PublicRoute redirectIfAuthenticated>
          <Login />
        </PublicRoute>
      }
    />
    <Route
      path={ROUTES.REGISTER}
      element={
        <PublicRoute redirectIfAuthenticated>
          <Register />
        </PublicRoute>
      }
    />
    <Route
      path={ROUTES.FORGOT_PASSWORD}
      element={
        <PublicRoute redirectIfAuthenticated>
          <ForgotPassword />
        </PublicRoute>
      }
    />
  </>
);
