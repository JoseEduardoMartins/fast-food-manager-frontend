import React from 'react';
import { Routes } from 'react-router-dom';
import { PublicRoutes } from './public';
import { AuthRoutes } from './auth';
import { ProtectedRoutes } from './protected';

/**
 * Main routes configuration
 * Combines all route types: public, auth, and protected
 */
export const AppRoutes = () => {
  return (
    <Routes>
      <PublicRoutes />
      <AuthRoutes />
      <ProtectedRoutes />
    </Routes>
  );
};
