import { Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { ROUTES } from './constants';

/**
 * Protected routes - require authentication
 * These routes should be wrapped with authentication guards
 * TODO: Add authentication guard HOC or wrapper
 */
export const ProtectedRoutes = (
    <>
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
    </>
  );
