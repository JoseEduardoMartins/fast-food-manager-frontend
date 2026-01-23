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
 * Address related types
 */
export interface Country {
  id: string;
  name: string;
  shortName: string;
  phoneCode: string;
}

export interface State {
  id: string;
  name: string;
  shortName: string;
  countryId: string;
}

export interface City {
  id: string;
  name: string;
  stateId: string;
}

export interface Address {
  id: string;
  street: string;
  number?: string;
  complement?: string;
  zipcode?: string;
  countryId: string;
  stateId: string;
  cityId: string;
  country: Country;
  state: State;
  city: City;
}

export interface UserAddress {
  id: string;
  userId: string;
  addressId: string;
  label?: string;
  isDefault: boolean;
  createdAt: string;
  address: Address;
}

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
  userAddresses?: UserAddress[];
}

/**
 * Address data for create/update user request
 * Agora envia dados completos do endereço ao invés de apenas addressId
 */
export interface UserAddressInput {
  id?: string; // ID do relacionamento user_address (apenas para update)
  street: string;
  number?: string;
  complement?: string;
  zipcode?: string;
  countryId: string;
  stateId: string;
  cityId: string;
  label?: string;
  isDefault?: boolean;
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
  addresses?: UserAddressInput[];
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
  addresses?: UserAddressInput[];
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

/**
 * Add address to user request
 */
export interface AddUserAddressRequest {
  addressId: string;
  label?: string;
  isDefault?: boolean;
}

/**
 * Update user address request
 */
export interface UpdateUserAddressRequest {
  addressId?: string;
  label?: string;
  isDefault?: boolean;
}

/**
 * Add user address response
 */
export interface AddUserAddressResponse {
  id: string;
}
