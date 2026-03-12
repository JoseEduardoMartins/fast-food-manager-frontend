/**
 * useProfile Hook
 * Loads and updates the logged-in user's profile (GET /users/:id, PATCH /users/:id)
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getUserById, updateUser } from '@services/users';
import type { User, UpdateUserRequest, UserAddressInput } from '@services/users';
import { listRoles, type Role } from '@services/roles';
import { profileFormSchema, type ProfileFormData } from '../Users/schemas';

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<UserAddressInput[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
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
    if (!userId) {
      setLoading(false);
      return;
    }
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getUserById(userId);
      setProfile(data);
      form.reset({
        name: data.name,
        email: data.email,
        roleId: data.roleId || '',
        password: '',
        confirmPassword: '',
      });
      const initialAddresses: UserAddressInput[] = (data.userAddresses ?? []).map((ua) => ({
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
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao carregar perfil';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      const cleanAddresses = addresses.map(({ country, state, city, ...address }) => address);
      const payload: UpdateUserRequest = {
        name: data.name,
        email: data.email,
        roleId: data.roleId,
        ...(data.password ? { password: data.password } : {}),
        addresses: cleanAddresses.length > 0 ? cleanAddresses : undefined,
      };
      await updateUser(userId, payload);
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
      await loadProfile();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      if (e.response?.status === 409) {
        setError('Email já está em uso');
        toast.error('Email já está em uso');
      } else {
        const msg = e.response?.data?.message ?? 'Erro ao atualizar perfil';
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddressesChange = (newAddresses: UserAddressInput[]) => {
    setAddresses(newAddresses);
  };

  return {
    profile,
    loading,
    saving,
    error,
    setError,
    form,
    addresses,
    handleAddressesChange,
    isEditing,
    setIsEditing,
    onSubmit,
    reloadProfile: loadProfile,
    roles,
    rolesLoading,
  };
};
