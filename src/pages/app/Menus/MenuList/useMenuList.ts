/**
 * useMenuList Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { listMenus, deleteMenu } from '@services/menus';
import type { Menu, ListMenusParams } from '@services/menus';

export const useMenuList = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const loadMenus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: ListMenusParams = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sort: { fields: ['name'], order: ['ASC'] },
      };
      if (selectedStatus !== 'all') {
        params.isActive = selectedStatus === 'active';
      }
      if (searchName.trim()) {
        params.name = searchName.trim();
      }
      const response = await listMenus(params);
      setMenus(response.data);
      setPagination({
        total: response.total,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar menus');
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, selectedStatus, searchName]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const handleDelete = async (id: string, menuName: string): Promise<void> => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o menu "${menuName}"? Não é possível excluir um menu vinculado a filiais.`
    );
    if (!confirmed) return;
    try {
      await deleteMenu(id);
      toast.success('Menu excluído com sucesso!');
      await loadMenus();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir menu';
      if (e.response?.status === 409) {
        toast.error('Menu está em uso por uma ou mais filiais.');
      } else {
        toast.error(msg);
      }
      setError(msg);
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSelectedStatus('all');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return {
    menus,
    loading,
    error,
    searchName,
    setSearchName,
    selectedStatus,
    setSelectedStatus,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
    loadMenus,
  };
};
