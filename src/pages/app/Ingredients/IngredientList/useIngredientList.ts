/**
 * useIngredientList Hook
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { listIngredients, deleteIngredient } from '@services/ingredients';
import type { Ingredient, ListIngredientsParams } from '@services/ingredients';

export const useIngredientList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
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

  const loadIngredients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: ListIngredientsParams = {
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
      const response = await listIngredients(params);
      setIngredients(response.data);
      setPagination({
        total: response.total,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar ingredientes');
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize, selectedStatus, searchName]);

  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  const handleDelete = async (id: string, ingredientName: string): Promise<void> => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o ingrediente "${ingredientName}"? Não é possível excluir um ingrediente em uso.`
    );
    if (!confirmed) return;
    try {
      await deleteIngredient(id);
      toast.success('Ingrediente excluído com sucesso!');
      await loadIngredients();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir ingrediente';
      if (e.response?.status === 409) {
        toast.error('Ingrediente está em uso e não pode ser removido.');
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
    ingredients,
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
    loadIngredients,
  };
};
