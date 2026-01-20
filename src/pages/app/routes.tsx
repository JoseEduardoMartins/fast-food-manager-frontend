import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';

/**
 * Protected routes - require authentication
 * These routes should be wrapped with authentication guards
 * TODO: Add authentication guard HOC or wrapper
 */
export const AppRoutes = (
    <>
      <Route path='/dashboard' element={<Dashboard />} />
    </>
  );
