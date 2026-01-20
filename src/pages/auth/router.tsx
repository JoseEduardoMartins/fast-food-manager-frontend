import { Route } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
import OwnerRegister from './OwnerRegister';
import Register from './Register';

/**
 * Authentication routes - login, registration, password recovery
 * These routes should redirect authenticated users to dashboard
 */
export const AuthRoutes = (
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/owner-register" element={<OwnerRegister />} />
    </>
  );
