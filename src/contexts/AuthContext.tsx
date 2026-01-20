/**
 * Authentication Context
 * Manages user authentication state throughout the application
 */

import React, { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { http } from '@config';
import { getAccessToken } from '@config';
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

    setUser(response.user);

    // Token is already stored by signInService
    // Set token in http defaults for immediate use
    if (response.token && http.defaults.headers) {
      http.defaults.headers.token = response.token;
    }
  };

  /**
   * Signs up a new user
   */
  const signUp = async (data: SignUpRequest): Promise<void> => {
    const response = await signUpService(data);

    // Set user with partial data (email and name from request)
    setUser({
      id: response.id,
      name: data.name,
      email: data.email,
      role: data.role || 'customer',
      companyId: data.companyId || null,
      branchId: data.branchId || null,
      isActive: true,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
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
      setUser({
        ...user,
        isVerified: true,
      });
    }
  };

  /**
   * Signs out the current user
   */
  const signOut = async (): Promise<void> => {
    signOutService();
    setUser(null);

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
      // Allow free navigation to public and auth routes
      setLoading(false);
      return;
    }

    // Set token in http defaults for authenticated requests
    if (http.defaults.headers) {
      http.defaults.headers.token = token;
    }

    // Try to get user information from token or make a request
    // For now, we'll just check if token exists
    // In a real scenario, you'd make an API call to get user info
    // Example: const response = await http.get<User>('/auth/me');
    
    try {
      // If you have a /me endpoint, uncomment this:
      // const response = await http.get<User>('/auth/me');
      // setUser(response.data);
      
      // For now, we'll just validate the token exists
      // The token will be validated on the next authenticated request
      // If invalid, the httpErrorHandler will handle it
      setLoading(false);
    } catch (error) {
      // Token invalid, clear it but don't redirect
      // Let the user navigate freely to public routes
      signOutService();
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
