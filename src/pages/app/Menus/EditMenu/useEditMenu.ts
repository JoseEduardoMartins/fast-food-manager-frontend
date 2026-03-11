/**
 * useEditMenu Hook
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getMenuById, updateMenu } from '@services/menus';
import type { Menu } from '@services/menus';
import { menuFormSchema, type MenuFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useEditMenu = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
  });

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.MENUS);
      return;
    }
    loadMenu();
  }, [id]);

  const loadMenu = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getMenuById(id);
      setMenu(data);
      form.reset({
        name: data.name,
        isActive: data.isActive,
      });
      setError(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar menu');
      toast.error('Erro ao carregar menu');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: MenuFormData) => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      await updateMenu(id, {
        name: data.name,
        isActive: data.isActive,
      });
      toast.success('Menu atualizado com sucesso!');
      navigate(ROUTES.MENUS_DETAILS.replace(':id', id));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao atualizar menu';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (id) navigate(ROUTES.MENUS_DETAILS.replace(':id', id));
    else navigate(ROUTES.MENUS);
  };

  return {
    menu,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
  };
};
