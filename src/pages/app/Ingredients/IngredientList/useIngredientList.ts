/**
 * useIngredientList Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebouncedEffect } from '@common/hooks';
import { toast } from 'sonner';
import { listIngredients, deleteIngredient } from '@services/ingredients';
import type { Ingredient, IngredientUnit, ListIngredientsParams } from '@services/ingredients';

export const useIngredientList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<IngredientUnit | 'all'>('all');
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const filtersRef = useRef({ searchName, selectedUnit });
  useEffect(() => {
    filtersRef.current = { searchName, selectedUnit };
  }, [searchName, selectedUnit]);

  const loadIngredients = useCallback(async (overridePageIndex?: number) => {
    const { searchName, selectedUnit } = filtersRef.current;
    const pageIndex = overridePageIndex ?? pagination.pageIndex;
    try {
      setLoading(true);
      setError(null);
      const params: ListIngredientsParams = {
        pageIndex,
        pageSize: pagination.pageSize,
        sort: { fields: ['name'], order: ['ASC'] },
      };
      if (searchName.trim()) {
        params.term = searchName.trim();
      }
      if (selectedUnit !== 'all') {
        params.unit = selectedUnit;
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
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  const isFirstSearchRender = useRef(true);
  useDebouncedEffect(() => {
    if (isFirstSearchRender.current) {
      isFirstSearchRender.current = false;
      return;
    }
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    loadIngredients(0);
  }, [searchName], 400);

  const handleDelete = async (id: number, ingredientName: string): Promise<void> => {
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
    loadIngredients(0);
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSelectedUnit('all');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setTimeout(() => loadIngredients(0), 0);
  };

  return {
    ingredients,
    loading,
    error,
    searchName,
    setSearchName,
    selectedUnit,
    setSelectedUnit,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
    loadIngredients,
  };
};
