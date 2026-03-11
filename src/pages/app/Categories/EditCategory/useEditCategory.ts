/**
 * useEditCategory Hook
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getCategoryById, updateCategory } from '@services/categories';
import type { Category } from '@services/categories';
import { categoryEditFormSchema, type CategoryEditFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useEditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CategoryEditFormData>({
    resolver: zodResolver(categoryEditFormSchema) as Resolver<CategoryEditFormData>,
  });

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.CATEGORIES);
      return;
    }
    loadCategory();
  }, [id, navigate]);

  const loadCategory = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getCategoryById(id);
      setCategory(data);
      form.reset({
        name: data.name,
        order: data.order,
        isActive: data.isActive,
      });
      setError(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar categoria');
      toast.error('Erro ao carregar categoria');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CategoryEditFormData) => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      await updateCategory(id, {
        name: data.name.trim(),
        order: Number(data.order),
        isActive: data.isActive ?? true,
      });
      toast.success('Categoria atualizada com sucesso!');
      navigate(ROUTES.CATEGORIES_DETAILS.replace(':id', id));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao atualizar categoria';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (id) navigate(ROUTES.CATEGORIES_DETAILS.replace(':id', id));
    else navigate(ROUTES.CATEGORIES);
  };

  return {
    category,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
  };
};
