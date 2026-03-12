/**
 * Storage utilities
 * LocalStorage management for application data
 */

/**
 * User storage key
 */
const USER_STORAGE_KEY = 'fast-food-manager-user';

/**
 * Permissions storage key (RBAC)
 */
const PERMISSIONS_STORAGE_KEY = 'fast-food-manager-permissions';

/**
 * Gets user data from localStorage
 */
export const getUserFromStorage = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem(`${USER_STORAGE_KEY}_${import.meta.env.MODE || 'development'}`);
  } catch {
    return null;
  }
};

/**
 * Sets user data in localStorage
 */
export const setUserInStorage = (userData: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(`${USER_STORAGE_KEY}_${import.meta.env.MODE || 'development'}`, userData);
  } catch {
    // Handle quota exceeded or other errors silently
  }
};

/**
 * Removes user data from localStorage
 */
export const removeUserFromStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(`${USER_STORAGE_KEY}_${import.meta.env.MODE || 'development'}`);
  } catch {
    // Handle errors silently
  }
};

/**
 * Gets permissions from localStorage
 */
export const getPermissionsFromStorage = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(`${PERMISSIONS_STORAGE_KEY}_${import.meta.env.MODE || 'development'}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Sets permissions in localStorage
 */
export const setPermissionsInStorage = (permissions: string[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      `${PERMISSIONS_STORAGE_KEY}_${import.meta.env.MODE || 'development'}`,
      JSON.stringify(permissions)
    );
  } catch {
    // ignore
  }
};

/**
 * Removes permissions from localStorage
 */
export const removePermissionsFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${PERMISSIONS_STORAGE_KEY}_${import.meta.env.MODE || 'development'}`);
  } catch {
    // ignore
  }
};
