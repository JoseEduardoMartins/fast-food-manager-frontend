/**
 * useCreateStock Hook - create branch-ingredient (prices in centavos)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { createBranchIngredient } from '@services/branch-ingredients';
import { stockFormSchema, type StockFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCreateStock = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<StockFormData>({
    resolver: zodResolver(stockFormSchema) as Resolver<StockFormData>,
    defaultValues: {
      branchId: '',
      ingredientId: '',
      stockQuantity: 0,
      stockMinQuantity: 0,
      purchasePrice: 0,
      salePrice: undefined,
    },
  });

  const onSubmit = async (data: StockFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const purchaseCentavos = Math.round(Number(data.purchasePrice) * 100);
      const saleCentavos = data.salePrice != null
        ? Math.round(Number(data.salePrice) * 100)
        : undefined;
      const { id } = await createBranchIngredient({
        branchId: data.branchId,
        ingredientId: data.ingredientId,
        stockQuantity: Number(data.stockQuantity),
        stockMinQuantity: Number(data.stockMinQuantity),
        purchasePrice: purchaseCentavos,
        salePrice: saleCentavos,
      });
      toast.success('Registro de estoque criado!');
      navigate(ROUTES.STOCK_DETAILS.replace(':id', id));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao criar estoque';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => navigate(ROUTES.STOCK);

  return { form, isLoading, error, setError, onSubmit, handleCancel };
};
