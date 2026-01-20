import React from 'react';
import { Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import OwnerRegister from '../pages/OwnerRegister';
import { ROUTES } from './constants';

/**
 * Authentication routes - login, registration, password recovery
 * These routes should redirect authenticated users to dashboard
 */
export const AuthRoutes = () => {
  return (
    <>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.OWNER_REGISTER} element={<OwnerRegister />} />
    </>
  );
};
