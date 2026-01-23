/**
 * useEditUser Hook
 * Custom hook for edit user page logic
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getUserById, updateUser } from '@services/users';
import type { User, UpdateUserRequest, UserAddressInput } from '@services/users';
import { userFormSchema, type UserFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useEditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<UserAddressInput[]>([]);

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
      
      // Only include role in form if it's an allowed role (not admin)
      const allowedRoles = ['owner', 'manager', 'cook', 'attendant', 'customer', 'delivery'] as const;
      const formRole = allowedRoles.includes(userData.role as any) ? userData.role : 'customer';
      
      // Reset form with user data
      form.reset({
        name: userData.name,
        email: userData.email,
        role: formRole as any,
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

  const onSubmit = async (data: UserFormData) => {
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      const updateData: UpdateUserRequest = {
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password, // Password is now required
        addresses: addresses.length > 0 ? addresses : undefined,
      };

      await updateUser(id, updateData);
      toast.success('Usuário atualizado com sucesso!');
      navigate(`${ROUTES.USERS}/${id}`);
    } catch (err: any) {
      console.error('Erro ao atualizar usuário:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar usuário';
      
      if (err.response?.status === 409) {
        setError('Email já está em uso');
        toast.error('Email já está em uso');
      } else if (err.response?.status === 404) {
        setError('Usuário ou endereço não encontrado');
        toast.error('Usuário ou endereço não encontrado');
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`${ROUTES.USERS}/${id}`);
    } else {
      navigate(ROUTES.USERS);
    }
  };

  const handleAddressesChange = (newAddresses: UserAddressInput[]) => {
    setAddresses(newAddresses);
  };

  return {
    user,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
    reloadUser: loadUser,
    addresses,
    handleAddressesChange,
  };
};
