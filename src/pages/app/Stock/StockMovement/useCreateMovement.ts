/**
 * useCreateMovement Hook - create ingredient-transaction (updates stock automatically)
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { createIngredientTransaction } from '@services/ingredient-transactions';
import { movementFormSchema, type MovementFormData } from '../movementSchemas';
import { ROUTES } from '@common/constants';

export const useCreateMovement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MovementFormData>({
    resolver: zodResolver(movementFormSchema) as Resolver<MovementFormData>,
    defaultValues: {
      branchId: searchParams.get('branchId') ?? '',
      ingredientId: searchParams.get('ingredientId') ?? '',
      type: 'input',
      quantity: 1,
      unitPrice: undefined,
      description: '',
    },
  });

  useEffect(() => {
    const branchId = searchParams.get('branchId');
    const ingredientId = searchParams.get('ingredientId');
    if (branchId) form.setValue('branchId', branchId);
    if (ingredientId) form.setValue('ingredientId', ingredientId);
  }, [searchParams, form]);

  const onSubmit = async (data: MovementFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const unitCentavos =
        data.unitPrice != null && Number(data.unitPrice) >= 0
          ? Math.round(Number(data.unitPrice) * 100)
          : undefined;
      await createIngredientTransaction({
        branchId: data.branchId,
        ingredientId: data.ingredientId,
        type: data.type,
        quantity: Number(data.quantity),
        unitPrice: unitCentavos,
        description: data.description?.trim() || undefined,
      });
      toast.success(
        data.type === 'input' ? 'Entrada registrada!' : 'Saída registrada!'
      );
      navigate(ROUTES.STOCK);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao registrar movimentação';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => navigate(ROUTES.STOCK);

  return { form, isLoading, error, setError, onSubmit, handleCancel };
};
