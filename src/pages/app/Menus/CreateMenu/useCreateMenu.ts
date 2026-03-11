/**
 * useCreateMenu Hook
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createMenu } from '@services/menus';
import { menuFormSchema, type MenuFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCreateMenu = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: '',
      isActive: true,
    },
  });

  const onSubmit = async (data: MenuFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { id } = await createMenu({
        name: data.name,
        isActive: data.isActive,
      });
      toast.success('Menu criado com sucesso!');
      navigate(ROUTES.MENUS_DETAILS.replace(':id', id));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao criar menu';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.MENUS);
  };

  return { form, isLoading, error, setError, onSubmit, handleCancel };
};
