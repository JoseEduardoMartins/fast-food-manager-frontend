/**
 * useUserDetails Hook
 * Custom hook for user details/view page logic
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getUserById, updateUser, deleteUser } from '@services/users';
import type { User } from '@services/users';
import { userFormSchema, type UserFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useUserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  });

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.USERS);
      return;
    }
    loadUser();
  }, [id]);

  const loadUser = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      // Fetch user with all data including addresses
      const userData = await getUserById(id);
      setUser(userData);
      
      // Set form values for view mode (roleId para RBAC)
      form.reset({
        name: userData.name,
        email: userData.email,
        roleId: userData.roleId || '',
        password: '',
        confirmPassword: '',
      });
      
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar usuário:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao carregar usuário';
      toast.error(errorMessage);
      setError(errorMessage);
      navigate(ROUTES.USERS);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!user) return;

    try {
      setToggling(true);
      await updateUser(user.id, { isActive: !user.isActive });
      toast.success(`Usuário ${user.isActive ? 'desativado' : 'ativado'} com sucesso!`);
      await loadUser();
    } catch (err: any) {
      console.error('Erro ao alterar status do usuário:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao alterar status do usuário';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o usuário "${user.name}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(user.id);
      toast.success('Usuário excluído com sucesso!');
      navigate(ROUTES.USERS);
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao excluir usuário';
      toast.error(errorMessage);
    }
  };

  const handleEdit = () => {
    if (user) {
      navigate(`${ROUTES.USERS}/${user.id}/edit`);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.USERS);
  };

  return {
    user,
    loading,
    error,
    setError,
    toggling,
    form,
    handleToggleActive,
    handleDelete,
    handleEdit,
    handleBack,
    reloadUser: loadUser,
  };
};
