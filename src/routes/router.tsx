import { BrowserRouter, Routes } from 'react-router-dom';
import { AuthRoutes } from './auth';
import { ProtectedRoutes } from './protected';
import { PublicRoutes } from './public';

/**
 * Main routes configuration
 * Combines all route types: public, auth, and protected
 */
export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {PublicRoutes}
        {AuthRoutes}
        {ProtectedRoutes}
      </Routes>
    </BrowserRouter>
  );
};
