/**
 * Roles (perfis de acesso) service types
 * RBAC - backend returns roles with permissions
 */

export interface Role {
  id: string;
  name: string;
  /** System roles cannot be deleted */
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
  /** Permission codes (e.g. users.list, orders.create) */
  permissions?: string[];
}

export interface CreateRoleRequest {
  name: string;
  permissions?: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  permissions?: string[];
}

export interface ListRolesParams {
  pageIndex?: number;
  pageSize?: number;
  name?: string;
  isSystem?: boolean;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ListRolesResponse {
  data: Role[];
  total: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateRoleResponse {
  id: string;
}
