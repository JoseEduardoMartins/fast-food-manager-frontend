/**
 * useRoleList Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { listRoles, deleteRole } from '@services/roles';
import type { Role, ListRolesParams } from '@services/roles';

export const useRoleList = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: ListRolesParams = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      };
      const response = await listRoles(params);
      setRoles(response.data);
      setPagination({
        total: response.total,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao carregar perfis';
      setError(msg);
      setRoles([]);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Excluir o perfil "${name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteRole(id);
      toast.success('Perfil excluído com sucesso!');
      await loadRoles();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir perfil';
      setError(msg);
      toast.error(msg);
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  };

  return {
    roles,
    loading,
    error,
    setError,
    pagination,
    handleDelete,
    handlePageChange,
    reload: loadRoles,
  };
};
