/**
 * useStockList Hook
 * Lists branch-ingredients (stock per branch)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useBranches } from '@common/hooks';
import { listBranchIngredients, deleteBranchIngredient } from '@services/branch-ingredients';
import { listIngredients } from '@services/ingredients';
import type { BranchIngredient, ListBranchIngredientsParams } from '@services/branch-ingredients';
import type { Ingredient } from '@services/ingredients';

export const useStockList = () => {
  const { branches, getBranchName } = useBranches({ pageSize: 500 });
  const [items, setItems] = useState<BranchIngredient[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>('all');
  const filtersRef = useRef({ selectedBranchId, selectedIngredientId });
  useEffect(() => {
    filtersRef.current = { selectedBranchId, selectedIngredientId };
  }, [selectedBranchId, selectedIngredientId]);
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const loadIngredients = useCallback(async () => {
    try {
      const ingRes = await listIngredients({
        pageSize: 500,
        sort: { fields: ['name'], order: ['ASC'] },
      });
      setIngredients(ingRes.data);
    } catch {
      setIngredients([]);
    }
  }, []);

  const loadStock = useCallback(async (overridePageIndex?: number) => {
    const { selectedBranchId, selectedIngredientId } = filtersRef.current;
    const pageIndex = overridePageIndex ?? pagination.pageIndex;
    try {
      setLoading(true);
      setError(null);
      const params: ListBranchIngredientsParams = {
        pageIndex,
        pageSize: pagination.pageSize,
        sort: { fields: ['branchId', 'ingredientId'], order: ['ASC', 'ASC'] },
      };
      if (selectedBranchId !== 'all') {
        params.branchId = selectedBranchId;
      }
      if (selectedIngredientId !== 'all') {
        params.ingredientId = Number(selectedIngredientId);
      }
      const response = await listBranchIngredients(params);
      setItems(response.data);
      setPagination({
        total: response.total,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar estoque');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  useEffect(() => {
    loadStock();
  }, [loadStock]);

  const handleDelete = async (id: string, label: string): Promise<void> => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o registro de estoque "${label}"?`
    );
    if (!confirmed) return;
    try {
      await deleteBranchIngredient(id);
      toast.success('Registro de estoque excluído!');
      await loadStock();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao excluir');
      toast.error(e.response?.data?.message ?? 'Erro ao excluir');
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  };

  const handleFilter = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    loadStock(0);
  };

  const handleClear = () => {
    setSelectedBranchId('all');
    setSelectedIngredientId('all');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setTimeout(() => loadStock(0), 0);
  };

  const getIngredientName = (ingredientId: number) =>
    ingredients.find((i) => i.id === ingredientId)?.name ?? String(ingredientId);

  return {
    items,
    branches,
    ingredients,
    loading,
    error,
    selectedBranchId,
    setSelectedBranchId,
    selectedIngredientId,
    setSelectedIngredientId,
    pagination,
    handleDelete,
    handlePageChange,
    handleFilter,
    handleClear,
    setError,
    loadStock,
    getBranchName,
    getIngredientName,
  };
};
