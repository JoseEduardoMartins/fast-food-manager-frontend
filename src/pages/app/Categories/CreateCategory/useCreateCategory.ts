/**
 * useCreateCategory Hook
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createCategory } from '@services/categories';
import { createCategoryFormSchema, type CreateCategoryFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCreateCategory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategoryFormSchema) as Resolver<CreateCategoryFormData>,
    defaultValues: {
      menuId: '',
      name: '',
      order: 0,
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateCategoryFormData) => {
    if (!data.menuId) {
      setError('Selecione um menu');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await createCategory({
        menuId: data.menuId,
        name: data.name.trim(),
        order: Number(data.order),
        isActive: data.isActive ?? true,
      });
      toast.success('Categoria criada com sucesso!');
      navigate(ROUTES.CATEGORIES);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao criar categoria';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.CATEGORIES);
  };

  return {
    form,
    isLoading,
    error,
    setError,
    onSubmit,
    handleCancel,
  };
};
