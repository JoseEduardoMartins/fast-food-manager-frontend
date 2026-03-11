/**
 * useStockDetails Hook
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import {
  getBranchIngredientById,
  deleteBranchIngredient,
} from '@services/branch-ingredients';
import { listIngredientTransactions } from '@services/ingredient-transactions';
import { listBranches } from '@services/branches';
import { listIngredients } from '@services/ingredients';
import type { BranchIngredient } from '@services/branch-ingredients';
import type { IngredientTransaction } from '@services/ingredient-transactions';
import { stockFormSchema, type StockFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useStockDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<BranchIngredient | null>(null);
  const [transactions, setTransactions] = useState<IngredientTransaction[]>([]);
  const [branchName, setBranchName] = useState('');
  const [ingredientName, setIngredientName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<StockFormData>({
    resolver: zodResolver(stockFormSchema) as Resolver<StockFormData>,
  });

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.STOCK);
      return;
    }
    load();
  }, [id]);

  const load = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getBranchIngredientById(id);
      setItem(data);
      form.reset({
        branchId: data.branchId,
        ingredientId: data.ingredientId,
        stockQuantity: data.stockQuantity,
        stockMinQuantity: data.stockMinQuantity,
        purchasePrice: data.purchasePrice / 100,
        salePrice: data.salePrice != null ? data.salePrice / 100 : undefined,
      });
      const [txRes, branchRes, ingRes] = await Promise.all([
        listIngredientTransactions({
          branchId: data.branchId,
          ingredientId: data.ingredientId,
          pageSize: 50,
          sort: { fields: ['createdAt'], order: ['DESC'] },
        }),
        listBranches({ pageSize: 500 }),
        listIngredients({ pageSize: 500 }),
      ]);
      setTransactions(txRes.data);
      const branch = branchRes.data.find((b) => b.id === data.branchId);
      const ing = ingRes.data.find((i) => i.id === data.ingredientId);
      setBranchName(branch?.name ?? '');
      setIngredientName(ing?.name ?? '');
      setError(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar');
      toast.error('Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !item) return;
    const confirmed = window.confirm('Tem certeza que deseja excluir este registro de estoque?');
    if (!confirmed) return;
    try {
      await deleteBranchIngredient(id);
      toast.success('Registro excluído!');
      navigate(ROUTES.STOCK);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao excluir');
      toast.error(e.response?.data?.message ?? 'Erro ao excluir');
    }
  };

  const handleEdit = () => navigate(ROUTES.STOCK_EDIT.replace(':id', id!));
  const handleBack = () => navigate(ROUTES.STOCK);
  const handleNewMovement = () =>
    navigate(`${ROUTES.STOCK_MOVEMENT}?branchId=${item?.branchId}&ingredientId=${item?.ingredientId}`);

  return {
    item,
    transactions,
    branchName,
    ingredientName,
    loading,
    error,
    setError,
    form,
    handleDelete,
    handleEdit,
    handleBack,
    handleNewMovement,
    load,
  };
};
