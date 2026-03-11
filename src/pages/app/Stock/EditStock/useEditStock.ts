/**
 * useEditStock Hook
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { getBranchIngredientById, updateBranchIngredient } from '@services/branch-ingredients';
import type { BranchIngredient } from '@services/branch-ingredients';
import { stockFormSchema, type StockFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useEditStock = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<BranchIngredient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        ingredientId: String(data.ingredientId),
        stockQuantity: data.stockQuantity,
        stockMinQuantity: data.stockMinQuantity,
        purchasePrice: data.purchasePrice / 100,
        salePrice: data.salePrice != null ? data.salePrice / 100 : undefined,
      });
      setError(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar');
      toast.error('Erro ao carregar');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: StockFormData) => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const purchaseCentavos = Math.round(Number(data.purchasePrice) * 100);
      const saleCentavos = data.salePrice != null
        ? Math.round(Number(data.salePrice) * 100)
        : undefined;
      await updateBranchIngredient(id, {
        stockQuantity: Number(data.stockQuantity),
        stockMinQuantity: Number(data.stockMinQuantity),
        purchasePrice: purchaseCentavos,
        salePrice: saleCentavos,
      });
      toast.success('Estoque atualizado!');
      navigate(ROUTES.STOCK_DETAILS.replace(':id', id));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao atualizar';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (id) navigate(ROUTES.STOCK_DETAILS.replace(':id', id));
    else navigate(ROUTES.STOCK);
  };

  return { item, loading, saving, error, setError, form, onSubmit, handleCancel };
};
