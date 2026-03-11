/**
 * useIngredientDetails Hook
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { getIngredientById, updateIngredient, deleteIngredient } from '@services/ingredients';
import type { Ingredient } from '@services/ingredients';
import { ingredientFormSchema, type IngredientFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useIngredientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

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
        isActive: data.isActive,
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

  const handleToggleActive = async () => {
    if (!id || !ingredient) return;
    try {
      setToggling(true);
      setError(null);
      await updateIngredient(id, { isActive: !ingredient.isActive });
      toast.success(
        `Ingrediente ${ingredient.isActive ? 'desativado' : 'ativado'} com sucesso!`
      );
      await loadIngredient();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao alterar status');
      toast.error(e.response?.data?.message ?? 'Erro ao alterar status');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !ingredient) return;
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o ingrediente "${ingredient.name}"? Não é possível excluir um ingrediente em uso.`
    );
    if (!confirmed) return;
    try {
      await deleteIngredient(id);
      toast.success('Ingrediente excluído com sucesso!');
      navigate(ROUTES.INGREDIENTS);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir ingrediente';
      if (e.response?.status === 409) {
        setError('Ingrediente está em uso e não pode ser removido.');
        toast.error('Ingrediente está em uso e não pode ser removido.');
      } else {
        setError(msg);
        toast.error(msg);
      }
    }
  };

  const handleEdit = () => {
    if (id) navigate(ROUTES.INGREDIENTS_EDIT.replace(':id', id));
  };

  const handleBack = () => {
    navigate(ROUTES.INGREDIENTS);
  };

  return {
    ingredient,
    loading,
    error,
    setError,
    toggling,
    form,
    handleToggleActive,
    handleDelete,
    handleEdit,
    handleBack,
  };
};
