/**
 * useCreateUser Hook
 * Custom hook for create user page logic
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createUser } from '@services/users';
import type { CreateUserRequest } from '@services/users';
import { createUserSchema, type CreateUserFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCreateUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
      isActive: true,
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const createData: CreateUserRequest = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        isActive: data.isActive ?? true,
      };

      const response = await createUser(createData);
      toast.success('Usuário criado com sucesso!');
      navigate(`${ROUTES.USERS}/${response.id}`);
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao criar usuário';
      
      if (err.response?.status === 409) {
        setError('Email já está em uso');
        toast.error('Email já está em uso');
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.USERS);
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
