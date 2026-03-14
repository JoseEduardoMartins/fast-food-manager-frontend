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

export type LinkType = 'owner' | 'employee';

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
  country?: Country;
  state?: State;
  city?: City;
}

export interface UserAddress {
  id: string;
  userId: string;
  addressId: string;
  label?: string;
  isDefault: boolean;
  createdAt?: string;
  address: Address;
}

/** Company (minimal) for user profile display */
export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  phone?: string;
  isActive: boolean;
}

/** Branch (minimal) for user profile display */
export interface Branch {
  id: string;
  name: string;
  nickname?: string;
  companyId: string;
  menuId?: string;
  phone?: string;
  isActive: boolean;
}

export interface UserCompany {
  id: string;
  userId: string;
  companyId: string;
  linkType: LinkType;
  company?: Company;
}

export interface UserBranch {
  id: string;
  userId: string;
  branchId: string;
  linkType: LinkType;
  branch?: Branch;
}

/**
 * Role from RBAC system
 */
export interface Role {
  id: string;
  name: string;
  code: string;
  isSystem?: boolean;
  description?: string | null;
}

/**
 * User data structure
 * Vínculos N:N via userCompanies e userBranches (não mais companyId/branchId)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | Role; // Pode ser enum legacy (auth) ou objeto Role (RBAC do backend)
  roleId?: string; // RBAC - ID do perfil de acesso
  isActive: boolean;
  isVerified: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  userCompanies?: UserCompany[];
  userBranches?: UserBranch[];
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
  // Dados adicionais para exibição (não enviados ao backend)
  country?: {
    id: string;
    name: string;
    shortName: string;
    phoneCode: string;
  };
  state?: {
    id: string;
    name: string;
    shortName: string;
  };
  city?: {
    id: string;
    name: string;
  };
}

/**
 * Create user request
 */
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole; // Legacy - opcional para compatibilidade
  roleId: string; // RBAC - ID do perfil de acesso (obrigatório)
  isActive?: boolean;
  companies?: Array<{ companyId: string; linkType: LinkType }>;
  branches?: Array<{ branchId: string; linkType: LinkType }>;
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
  role?: UserRole; // Legacy - opcional para compatibilidade
  roleId?: string; // RBAC - ID do perfil de acesso
  isActive?: boolean;
  companies?: Array<{ companyId: string; linkType: LinkType }>;
  branches?: Array<{ branchId: string; linkType: LinkType }>;
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
  role?: UserRole; // Legacy
  roleId?: string; // RBAC - filtrar por perfil de acesso
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
