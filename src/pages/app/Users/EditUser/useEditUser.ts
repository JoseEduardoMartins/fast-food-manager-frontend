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
import { listRoles, type Role } from '@services/roles';
import { userFormEditSchema, type UserFormEditData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useEditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<UserAddressInput[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const form = useForm<UserFormEditData>({
    resolver: zodResolver(userFormEditSchema),
  });

  // Carregar roles disponíveis
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await listRoles({ pageSize: 100 });
        setRoles(response.data);
      } catch (err) {
        console.error('Erro ao carregar perfis:', err);
        toast.error('Erro ao carregar perfis de acesso');
      } finally {
        setRolesLoading(false);
      }
    };

    loadRoles();
  }, []);

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
      const userData = await getUserById(id);
      setUser(userData);

      form.reset({
        name: userData.name,
        email: userData.email,
        roleId: userData.roleId || '', // RBAC - pré-selecionar roleId
        password: '',
        confirmPassword: '',
      });

      const initialAddresses: UserAddressInput[] = (userData.userAddresses ?? []).map((ua) => ({
        id: ua.id,
        street: ua.address.street,
        number: ua.address.number,
        complement: ua.address.complement,
        zipcode: ua.address.zipcode,
        countryId: ua.address.countryId,
        stateId: ua.address.stateId,
        cityId: ua.address.cityId,
        label: ua.label,
        isDefault: ua.isDefault,
        country: ua.address.country,
        state: ua.address.state,
        city: ua.address.city,
      }));
      setAddresses(initialAddresses);

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

  const onSubmit = async (data: UserFormEditData) => {
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      const cleanAddresses = addresses.map(({ country, state, city, ...address }) => address);

      const updateData: UpdateUserRequest = {
        name: data.name,
        email: data.email,
        roleId: data.roleId, // RBAC - envia roleId
        ...(data.password ? { password: data.password } : {}),
        addresses: cleanAddresses.length > 0 ? cleanAddresses : undefined,
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
    roles,
    rolesLoading,
  };
};
