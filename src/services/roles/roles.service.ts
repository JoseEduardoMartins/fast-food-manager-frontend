/**
 * Roles (perfis de acesso) service
 * CRUD for RBAC roles and permissions
 */

import { http } from '@config';
import { buildQueryParams, type QueryParamValue } from '@common/helpers';
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreateRoleResponse,
  ListRolesParams,
  ListRolesResponse,
} from './roles.types';

export const listRoles = async (params?: ListRolesParams): Promise<ListRolesResponse> => {
  const queryString = buildQueryParams(params as Record<string, QueryParamValue>);
  const response = await http.get<ListRolesResponse>(`/roles${queryString}`);
  return response.data;
};

export const getRoleById = async (id: string): Promise<Role> => {
  const response = await http.get<Role>(`/roles/${id}`);
  const data = response.data;

  // Backend retorna rolePermissions[].permission.code; mapeamos para Role.permissions (string[])
  const mappedPermissions =
    data.rolePermissions
      ?.map((rp) => rp.permission?.code)
      .filter((code): code is string => !!code) ?? [];

  return {
    ...data,
    permissions: mappedPermissions,
  };
};

export const createRole = async (data: CreateRoleRequest): Promise<CreateRoleResponse> => {
  const response = await http.post<CreateRoleResponse>('/roles', data);
  return response.data;
};

export const updateRole = async (id: string, data: UpdateRoleRequest): Promise<void> => {
  await http.patch(`/roles/${id}`, data);
};

export const deleteRole = async (id: string): Promise<void> => {
  await http.delete(`/roles/${id}`);
};
