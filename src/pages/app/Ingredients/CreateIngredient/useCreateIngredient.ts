/**
 * useCreateIngredient Hook
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { createIngredient } from '@services/ingredients';
import { ingredientFormSchema, type IngredientFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCreateIngredient = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientFormSchema) as Resolver<IngredientFormData>,
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
    },
  });

  const onSubmit = async (data: IngredientFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { id } = await createIngredient({
        name: data.name,
        description: data.description?.trim() || undefined,
        isActive: data.isActive,
      });
      toast.success('Ingrediente criado com sucesso!');
      navigate(ROUTES.INGREDIENTS_DETAILS.replace(':id', id));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao criar ingrediente';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.INGREDIENTS);
  };

  return { form, isLoading, error, setError, onSubmit, handleCancel };
};
