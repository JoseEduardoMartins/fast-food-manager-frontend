/**
 * Environment configuration
 * Loads and exports environment variables from .env file
 */

export const application = {
  mode: import.meta.env.MODE || 'development',
  domain: import.meta.env.VITE_COOKIE_DOMAIN || (typeof window !== 'undefined' ? window.location.hostname : ''),
  path: '/'
};

export const api = {
  url: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
};

export const env = {
  // Application Configuration
  APP_KEY: import.meta.env.VITE_APP_KEY || 'fast-food-manager-key',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Fast Food Manager',
  
  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  
  // Token Configuration
  ACCESS_TOKEN_KEY: import.meta.env.VITE_ACCESS_TOKEN_KEY || 'access_token',
  REFRESH_TOKEN_KEY: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token',
  
  // Cookie Configuration
  COOKIE_SECURE: import.meta.env.VITE_COOKIE_SECURE === 'true' || false,
  COOKIE_SAME_SITE: (import.meta.env.VITE_COOKIE_SAME_SITE || 'Lax') as 'Strict' | 'Lax' | 'None',
} as const;

/**
 * Validates required environment variables
 */
export const validateEnv = (): void => {
  const required = ['VITE_API_URL'];
  const missing = required.filter((key) => !import.meta.env[key]);
  
  if (missing.length > 0 && env.IS_PRODUCTION) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Validate environment on import (only in production)
if (env.IS_PRODUCTION) {
  validateEnv();
}

export default { application, api, env };
