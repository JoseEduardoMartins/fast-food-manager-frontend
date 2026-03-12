/**
 * Authentication Context
 * Manages user authentication state throughout the application
 */

import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '@config';
import { getAccessToken } from '@config';
import { getUserFromStorage, setUserInStorage, removeUserFromStorage } from '@config';
import {
  signUp as signUpService,
  signIn as signInService,
  confirmSignUp as confirmSignUpService,
  signOut as signOutService,
} from '@services/auth';
import type {
  User,
  SignUpRequest,
  SignInRequest,
} from '@services/auth';
import { ROUTES } from '@common/constants';

/**
 * Confirm Sign Up payload type
 */
export type ConfirmSignUpType = {
  securityCode: string;
};

/**
 * Auth Context Type
 */
export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (data: SignInRequest) => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
  confirmSignUp: (data: ConfirmSignUpType) => Promise<void>;
  signOut: () => Promise<void>;
};

/**
 * Auth Provider Props
 */
type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Create Auth Context
 */
const AuthContext = createContext({} as AuthContextType);

/**
 * Auth Provider Component
 */
/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isAuthenticated = !!user;

  /**
   * Signs in a user
   */
  const signIn = async (data: SignInRequest): Promise<void> => {
    const response = await signInService(data);

    // Store user data in localStorage
    setUser(response.user);
    setUserInStorage(JSON.stringify(response.user));

    // Token is already stored by signInService
    // Set token in http defaults for immediate use
    if (response.token && http.defaults.headers) {
      http.defaults.headers.token = response.token;
    }

    // Redirect to dashboard (same for all users, content adapts by role)
    navigate(ROUTES.DASHBOARD);
  };

  /**
   * Signs up a new user
   */
  const signUp = async (data: SignUpRequest): Promise<void> => {
    const response = await signUpService(data);

    // Set user with partial data (email and name from request)
    const userData: User = {
      id: response.id,
      name: data.name,
      email: data.email,
      role: data.role || 'customer',
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(userData);
    // Don't store in localStorage on signup since user needs to confirm email first
  };

  /**
   * Confirms user email with security code
   */
  const confirmSignUp = async (data: ConfirmSignUpType): Promise<void> => {
    if (!user?.email) {
      throw new Error('User email is required for confirmation');
    }

    await confirmSignUpService({
      email: user.email,
      securityCode: data.securityCode,
    });

    // Update user as verified
    if (user) {
      const updatedUser = {
        ...user,
        isVerified: true,
      };
      setUser(updatedUser);
      // Update user in storage
      setUserInStorage(JSON.stringify(updatedUser));
    }
  };

  /**
   * Signs out the current user
   */
  const signOut = async (): Promise<void> => {
    signOutService();
    setUser(null);
    removeUserFromStorage();

    // Clear token from http defaults
    if (http.defaults.headers) {
      delete http.defaults.headers.token;
    }

    navigate(ROUTES.LOGIN);
  };

  /**
   * Loads stored authentication data
   */
  const loadStoredData = async (): Promise<void> => {
    const token = getAccessToken();

    if (!token) {
      // No token found, user is not authenticated
      // Clear user from state if exists
      setUser(null);
      removeUserFromStorage();
      setLoading(false);
      return;
    }

    // Set token in http defaults for authenticated requests
    if (http.defaults.headers) {
      http.defaults.headers.token = token;
    }

    // Try to recover user data from localStorage
    try {
      const storedUserData = getUserFromStorage();
      
      if (storedUserData) {
        // Parse and set user from localStorage
        const userData: User = JSON.parse(storedUserData);
        setUser(userData);
        setLoading(false);
        return;
      }

      // If no user data in storage but token exists, try to get from API
      // If you have a /me endpoint, uncomment this:
      // const response = await http.get<User>('/auth/me');
      // setUser(response.data);
      // setUserInStorage(JSON.stringify(response.data));
      
      // For now, if no user data in storage, we'll just validate the token exists
      // The token will be validated on the next authenticated request
      // If invalid, the httpErrorHandler will handle it
      setLoading(false);
    } catch (error) {
      // Invalid stored data or token, clear everything
      signOutService();
      removeUserFromStorage();
      setUser(null);
      if (http.defaults.headers) {
        delete http.defaults.headers.token;
      }
      setLoading(false);
    }
  };

  /**
   * Effect to load stored data on mount
   */
  useEffect(() => {
    loadStoredData();
     
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        signIn,
        signUp,
        confirmSignUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use Auth Context
 */
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
