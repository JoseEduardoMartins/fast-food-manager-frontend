/**
 * useCreateRole Hook
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createRole } from '@services/roles';
import type { CreateRoleRequest } from '@services/roles';
import { ROUTES } from '@common/constants';

export const useCreateRole = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: { name: string; permissions: string[] }) => {
    setLoading(true);
    setError(null);
    try {
      const payload: CreateRoleRequest = {
        name: data.name.trim(),
        permissions: data.permissions.length > 0 ? data.permissions : undefined,
      };
      const res = await createRole(payload);
      toast.success('Perfil criado com sucesso!');
      navigate(`${ROUTES.ROLES}/${res.id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao criar perfil';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => navigate(ROUTES.ROLES);

  return { loading, error, setError, onSubmit, onCancel };
};
