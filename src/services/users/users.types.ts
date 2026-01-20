/**
 * User service types
 * Based on backend API documentation
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
 * User data structure
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string | null;
  branchId: string | null;
  isActive: boolean;
  isVerified: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create user request
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId?: string;
  branchId?: string;
  isActive?: boolean;
}

/**
 * Update user request
 * All fields are optional
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  companyId?: string;
  branchId?: string;
  isActive?: boolean;
}

/**
 * Create user response
 */
export interface CreateUserResponse {
  id: string;
}

/**
 * List users query params
 */
export interface ListUsersParams {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  email?: string;
  role?: UserRole;
  companyId?: string;
  branchId?: string;
  isActive?: boolean;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  selectFields?: string[];
}

/**
 * List users response
 */
export interface ListUsersResponse {
  data: User[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}
