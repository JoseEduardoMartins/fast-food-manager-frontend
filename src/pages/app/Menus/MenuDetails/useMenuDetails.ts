/**
 * useMenuDetails Hook
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getMenuById, updateMenu, deleteMenu } from '@services/menus';
import type { Menu } from '@services/menus';
import { menuFormSchema, type MenuFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useMenuDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

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

  const handleToggleActive = async () => {
    if (!id || !menu) return;
    try {
      setToggling(true);
      setError(null);
      await updateMenu(id, { isActive: !menu.isActive });
      toast.success(
        `Menu ${menu.isActive ? 'desativado' : 'ativado'} com sucesso!`
      );
      await loadMenu();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao alterar status');
      toast.error(e.response?.data?.message ?? 'Erro ao alterar status');
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !menu) return;
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o menu "${menu.name}"? Não é possível excluir um menu vinculado a filiais.`
    );
    if (!confirmed) return;
    try {
      await deleteMenu(id);
      toast.success('Menu excluído com sucesso!');
      navigate(ROUTES.MENUS);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir menu';
      if (e.response?.status === 409) {
        setError('Menu está em uso por uma ou mais filiais.');
        toast.error('Menu está em uso por uma ou mais filiais.');
      } else {
        setError(msg);
        toast.error(msg);
      }
    }
  };

  const handleEdit = () => {
    if (id) navigate(ROUTES.MENUS_EDIT.replace(':id', id));
  };

  const handleBack = () => {
    navigate(ROUTES.MENUS);
  };

  return {
    menu,
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
