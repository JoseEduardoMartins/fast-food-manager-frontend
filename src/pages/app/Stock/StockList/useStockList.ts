/**
 * useStockList Hook
 * Lists branch-ingredients (stock per branch)
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { listBranchIngredients, deleteBranchIngredient } from '@services/branch-ingredients';
import { listBranches } from '@services/branches';
import { listIngredients } from '@services/ingredients';
import type { BranchIngredient, ListBranchIngredientsParams } from '@services/branch-ingredients';
import type { Branch } from '@services/branches';
import type { Ingredient } from '@services/ingredients';

export const useStockList = () => {
  const [items, setItems] = useState<BranchIngredient[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const loadBranchesAndIngredients = useCallback(async () => {
    try {
      const [branchRes, ingRes] = await Promise.all([
        listBranches({ pageSize: 500, sort: { fields: ['name'], order: ['ASC'] } }),
        listIngredients({ pageSize: 500, sort: { fields: ['name'], order: ['ASC'] } }),
      ]);
      setBranches(branchRes.data);
      setIngredients(ingRes.data);
    } catch {
      setBranches([]);
      setIngredients([]);
    }
  }, []);

  const loadStock = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: ListBranchIngredientsParams = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sort: { fields: ['branchId', 'ingredientId'], order: ['ASC', 'ASC'] },
      };
      if (selectedBranchId !== 'all') {
        params.branchId = selectedBranchId;
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
  }, [pagination.pageIndex, pagination.pageSize, selectedBranchId]);

  useEffect(() => {
    loadBranchesAndIngredients();
  }, [loadBranchesAndIngredients]);

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
  };

  const getBranchName = (branchId: string) =>
    branches.find((b) => b.id === branchId)?.name ?? branchId.slice(0, 8);
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
    pagination,
    handleDelete,
    handlePageChange,
    handleFilter,
    setError,
    loadStock,
    getBranchName,
    getIngredientName,
  };
};
