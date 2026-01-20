/**
 * Cookie management utilities
 * Simplified cookie management using js-cookie library
 */

import Cookies from 'js-cookie';
import { application, env } from './environment';

/**
 * Cookie attributes interface matching js-cookie
 */
interface CookieAttributes {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

/**
 * Gets default cookie options based on environment
 */
const getDefaultOptions = (): CookieAttributes => {
  const sameSiteMap: Record<string, 'strict' | 'lax' | 'none'> = {
    Strict: 'strict',
    Lax: 'lax',
    None: 'none',
    strict: 'strict',
    lax: 'lax',
    none: 'none',
  };

  return {
    domain: application.domain || undefined,
    path: application.path,
    secure: env.COOKIE_SECURE,
    sameSite: sameSiteMap[env.COOKIE_SAME_SITE] || 'lax',
  };
};

/**
 * Gets a cookie value by name
 * @param key - Cookie key name
 * @returns Cookie value or undefined if not found
 */
export const getCookie = (key: string): string | undefined => {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const cookie = Cookies.get(`${key}_${application.mode}`);
  return cookie;
};

/**
 * Sets a cookie with the given name and value
 * @param key - Cookie key name
 * @param value - Cookie value
 * @param options - Cookie options
 */
export const setCookie = (
  key: string,
  value: string,
  options?: CookieAttributes
): void => {
  if (typeof document === 'undefined') {
    return;
  }

  Cookies.set(`${key}_${application.mode}`, value, {
    ...getDefaultOptions(),
    ...options
  });
};

/**
 * Removes a cookie by name
 * @param key - Cookie key name
 * @param options - Cookie options (must match the options used when setting)
 */
export const removeCookie = (key: string, options?: CookieAttributes): void => {
  if (typeof document === 'undefined') {
    return;
  }

  Cookies.remove(`${key}_${application.mode}`, {
    ...getDefaultOptions(),
    ...options
  });
};

/**
 * Gets the access token from cookies
 */
export const getAccessToken = (): string | undefined => {
  return getCookie(env.ACCESS_TOKEN_KEY);
};

/**
 * Sets the access token in cookies
 * @param token - Access token value
 */
export const setAccessToken = (token: string): void => {
  // expires in js-cookie can be a number (days) or Date
  // 30 minutes = 0.5 hours = 0.5/24 days ≈ 0.021 days
  setCookie(env.ACCESS_TOKEN_KEY, token, {
    expires: 1 / 48 // 30 minutes (1/48 of a day)
  });
};

/**
 * Removes the access token from cookies
 */
export const removeAccessToken = (): void => {
  removeCookie(env.ACCESS_TOKEN_KEY);
};

/**
 * Gets the refresh token from cookies
 */
export const getRefreshToken = (): string | undefined => {
  return getCookie(env.REFRESH_TOKEN_KEY);
};

/**
 * Sets the refresh token in cookies
 * @param token - Refresh token value
 */
export const setRefreshToken = (token: string): void => {
  setCookie(env.REFRESH_TOKEN_KEY, token, {
    expires: 1 // 1 day
  });
};

/**
 * Removes the refresh token from cookies
 */
export const removeRefreshToken = (): void => {
  removeCookie(env.REFRESH_TOKEN_KEY);
};
