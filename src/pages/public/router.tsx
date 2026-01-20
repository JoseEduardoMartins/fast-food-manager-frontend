import { Route } from 'react-router-dom';
import Careers from './Careers';
import Contact from './Contact';
import Home from './Home';
import Platform from './Platform';

/**
 * Public routes - accessible to all users without authentication
 */
export const PublicRoutes = (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/platform" element={<Platform />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/careers" element={<Careers />} />
    </>
  );
