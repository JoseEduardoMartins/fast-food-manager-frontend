/**
 * useEditIngredient Hook
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { getIngredientById, updateIngredient } from '@services/ingredients';
import type { Ingredient } from '@services/ingredients';
import { ingredientFormSchema, type IngredientFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useEditIngredient = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientFormSchema) as Resolver<IngredientFormData>,
  });

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.INGREDIENTS);
      return;
    }
    loadIngredient();
  }, [id]);

  const loadIngredient = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getIngredientById(id);
      setIngredient(data);
      form.reset({
        name: data.name,
        description: data.description ?? '',
        unit: data.unit,
      });
      setError(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar ingrediente');
      toast.error('Erro ao carregar ingrediente');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: IngredientFormData) => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      await updateIngredient(id, {
        name: data.name,
        description: data.description?.trim() || undefined,
        unit: data.unit,
      });
      toast.success('Ingrediente atualizado com sucesso!');
      navigate(ROUTES.INGREDIENTS_DETAILS.replace(':id', id));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao atualizar ingrediente';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (id) navigate(ROUTES.INGREDIENTS_DETAILS.replace(':id', id));
    else navigate(ROUTES.INGREDIENTS);
  };

  return {
    ingredient,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
  };
};
