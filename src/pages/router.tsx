import { BrowserRouter, Routes } from 'react-router-dom';
import { AuthProvider } from '@contexts';
import { AuthRoutes } from '@pages/auth';
import { AppRoutes } from '@pages/app';
import { PublicRoutes } from '@pages/public';

/**
 * Main routes configuration
 * Combines all route types: public, auth, and protected
 */
export const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {PublicRoutes}
          {AuthRoutes}
          {AppRoutes}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
