import { Route } from 'react-router-dom';
import Careers from './Careers';
import Contact from './Contact';
import Home from './Home';
import Platform from './Platform';
import { ROUTES } from '../../common/constants';

/**
 * Public routes - accessible to all users without authentication
 */
export const PublicRoutes = (
    <>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.PLATFORM} element={<Platform />} />
      <Route path={ROUTES.CONTACT} element={<Contact />} />
      <Route path={ROUTES.CAREERS} element={<Careers />} />
    </>
  );
