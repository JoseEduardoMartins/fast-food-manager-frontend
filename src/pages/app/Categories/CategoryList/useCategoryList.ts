/**
 * useCategoryList Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { listCategories, deleteCategory } from '@services/categories';
import { listMenus } from '@services/menus';
import type { Category, ListCategoriesParams } from '@services/categories';
import type { Menu } from '@services/menus';

export const useCategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<string>('');
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
      const res = await listMenus({
        pageSize: 200,
        sort: { fields: ['name'], order: ['ASC'] },
      });
      setMenus(res.data);
    } catch {
      setMenus([]);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: ListCategoriesParams = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sort: { fields: ['order', 'name'], order: ['ASC', 'ASC'] },
      };
      if (selectedMenuId) {
        params.menuId = selectedMenuId;
      }
      if (selectedStatus !== 'all') {
        params.isActive = selectedStatus === 'active';
      }
      if (searchName.trim()) {
        params.term = searchName.trim();
      }
      const response = await listCategories(params);
      setCategories(response.data);
      setPagination({
        total: response.total,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar categorias');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    selectedMenuId,
    selectedStatus,
    searchName,
  ]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleDelete = async (id: string, categoryName: string): Promise<void> => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a categoria "${categoryName}"? Remova antes os produtos vinculados se a API retornar conflito.`
    );
    if (!confirmed) return;
    try {
      await deleteCategory(id);
      toast.success('Categoria excluída com sucesso!');
      await loadCategories();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir categoria';
      if (e.response?.status === 409) {
        toast.error('Categoria possui produtos vinculados. Remova os vínculos antes.');
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
    setSelectedMenuId('');
    setSelectedStatus('all');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const getMenuNameById = (menuId: string) => {
    const menu = menus.find((m) => m.id === menuId);
    return menu?.name ?? menuId;
  };

  return {
    categories,
    menus,
    loading,
    error,
    searchName,
    setSearchName,
    selectedMenuId,
    setSelectedMenuId,
    selectedStatus,
    setSelectedStatus,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
    loadCategories,
    getMenuNameById,
  };
};
