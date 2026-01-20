import { Route } from 'react-router-dom';
import Careers from '../pages/Careers';
import Contact from '../pages/Contact';
import Home from '../pages/Home';
import Platform from '../pages/Platform';
import { ROUTES } from './constants';

/**
 * Public routes - accessible to all users without authentication
 */
export const PublicRoutes = () => {
  return (
    <>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.PLATFORM} element={<Platform />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path={ROUTES.CAREERS} element={<Careers />} />
    </>
  );
};
