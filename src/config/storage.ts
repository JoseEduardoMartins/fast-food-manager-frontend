/**
 * Storage utilities
 * LocalStorage management for application data
 */

/**
 * User storage key
 */
const USER_STORAGE_KEY = 'fast-food-manager-user';

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
