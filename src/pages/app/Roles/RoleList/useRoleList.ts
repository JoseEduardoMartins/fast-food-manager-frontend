/**
 * useRoleList Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { listRoles, deleteRole } from '@services/roles';
import type { Role, ListRolesParams } from '@services/roles';

export const useRoleList = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'system' | 'custom'>('all');
  const filtersRef = useRef({ searchName, selectedType });
  useEffect(() => {
    filtersRef.current = { searchName, selectedType };
  }, [searchName, selectedType]);
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const loadRoles = useCallback(async (overridePageIndex?: number) => {
    const { searchName, selectedType } = filtersRef.current;
    const pageIndex = overridePageIndex ?? pagination.pageIndex;
    try {
      setLoading(true);
      setError(null);
      const params: ListRolesParams = {
        pageIndex,
        pageSize: pagination.pageSize,
      };
      if (searchName.trim()) {
        params.name = searchName.trim();
      }
      if (selectedType !== 'all') {
        params.isSystem = selectedType === 'system';
      }
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

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    loadRoles(0);
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSelectedType('all');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setTimeout(() => loadRoles(0), 0);
  };

  return {
    roles,
    loading,
    error,
    setError,
    searchName,
    setSearchName,
    selectedType,
    setSelectedType,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    reload: loadRoles,
  };
};
