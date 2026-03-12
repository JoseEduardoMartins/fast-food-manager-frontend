/**
 * Roles (perfis de acesso) service types
 * RBAC - backend returns roles with permissions
 */

export interface Role {
  id: string;
  name: string;
  code?: string;
  description?: string | null;
  /** System roles cannot be deleted */
  isSystem?: boolean;
  createdAt?: string;
  updatedAt?: string;
  /** Permission codes (e.g. users.list, orders.create) */
  permissions?: string[];
  /** Raw relation from backend - used only for mapping */
  rolePermissions?: Array<{
    id: string;
    roleId: string;
    permissionId: string;
    createdAt?: string;
    permission?: {
      id: string;
      code: string;
      name: string;
      module: string;
      description?: string | null;
      createdAt?: string;
      updatedAt?: string;
    };
  }>;
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
