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
import type { CreateUserRequest, UserAddressInput } from '@services/users';
import { userFormSchema, type UserFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCreateUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<UserAddressInput[]>([]);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'customer',
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Remove dados extras (country, state, city) antes de enviar ao backend
      const cleanAddresses = addresses.map(({ country, state, city, ...address }) => address);

      const createData: CreateUserRequest = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        isActive: true, // Always active on creation
        addresses: cleanAddresses.length > 0 ? cleanAddresses : undefined,
      };

      const response = await createUser(createData);
      toast.success('Usuário criado com sucesso!');
      navigate(`${ROUTES.USERS}/${response.id}`);
    } catch (err: unknown) {
      console.error('Erro ao criar usuário:', err);
      const error = err as { response?: { data?: { message?: string }; status?: number } };
      const errorMessage = error.response?.data?.message || 'Erro ao criar usuário';
      
      if (error.response?.status === 409) {
        setError('Email já está em uso');
        toast.error('Email já está em uso');
      } else if (error.response?.status === 404) {
        setError('Endereço não encontrado');
        toast.error('Um ou mais endereços não foram encontrados');
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

  const handleAddressesChange = (newAddresses: UserAddressInput[]) => {
    setAddresses(newAddresses);
  };

  return {
    form,
    isLoading,
    error,
    setError,
    onSubmit,
    handleCancel,
    addresses,
    handleAddressesChange,
  };
};
