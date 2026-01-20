import { BrowserRouter, Routes } from 'react-router-dom';
import { AuthRoutes } from './auth';
import { AppRoutes } from './app';
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
        {AppRoutes}
      </Routes>
    </BrowserRouter>
  );
};
