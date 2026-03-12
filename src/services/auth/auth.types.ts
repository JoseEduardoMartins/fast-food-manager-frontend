/**
 * Authentication service types
 * User no longer has companyId/branchId; backend uses userCompanies/userBranches (N:N)
 */

export type UserRole =
  | 'admin'
  | 'owner'
  | 'manager'
  | 'cook'
  | 'attendant'
  | 'customer'
  | 'delivery';

/**
 * User data structure (minimal, as returned by sign-in)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sign Up request payload
 */
export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

/**
 * Sign Up response
 */
export interface SignUpResponse {
  id: string;
}

/**
 * Sign In request payload
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Sign In response
 */
export interface SignInResponse {
  token: string;
  refreshToken: string;
  user: User;
}

/**
 * Confirm Sign Up request payload
 */
export interface ConfirmSignUpRequest {
  email: string;
  securityCode: string;
}

/**
 * Confirm Sign Up response
 */
export interface ConfirmSignUpResponse {
  message: string;
}

/**
 * API Error response
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}
