/**
 * Authentication service
 * Handles user authentication operations
 */

import { http } from '@config';
import { setAccessToken, setRefreshToken, removeAccessToken, removeRefreshToken } from '@config';
import type {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  ConfirmSignUpRequest,
  ConfirmSignUpResponse,
} from './auth.types';

/**
 * Signs up a new user
 * @param data - User registration data
 * @returns User ID
 */
export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await http.post<SignUpResponse>('/auth/sign-up', data);
  return response.data;
};

/**
 * Signs in a user
 * @param data - User credentials
 * @returns Authentication tokens and user data
 */
export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  const response = await http.post<SignInResponse>('/auth/sign-in', data);
  const authData = response.data;
  
  // Store tokens after successful login
  if (authData.token && authData.refreshToken) {
    setAccessToken(authData.token);
    setRefreshToken(authData.refreshToken);
  }
  
  return authData;
};

/**
 * Confirms user email with security code
 * @param data - Email and security code
 * @returns Success message
 */
export const confirmSignUp = async (
  data: ConfirmSignUpRequest
): Promise<ConfirmSignUpResponse> => {
  const response = await http.post<ConfirmSignUpResponse>(
    '/auth/confirm-sign-up',
    data
  );
  return response.data;
};

/**
 * Signs out the current user
 * Removes stored tokens
 */
export const signOut = (): void => {
  removeAccessToken();
  removeRefreshToken();
};
