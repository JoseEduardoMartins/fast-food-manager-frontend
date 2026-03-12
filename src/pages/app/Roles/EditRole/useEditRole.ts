/**
 * useEditRole Hook
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getRoleById, updateRole } from '@services/roles';
import type { Role, UpdateRoleRequest } from '@services/roles';
import { ROUTES } from '@common/constants';

export const useEditRole = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.ROLES);
      return;
    }
    loadRole();
  }, [id]);

  const loadRole = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getRoleById(id);
      setRole(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar perfil');
      toast.error('Erro ao carregar perfil');
      navigate(ROUTES.ROLES);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: { name: string; permissions: string[] }) => {
    if (!id || !role || role.isSystem) return;
    setSaving(true);
    setError(null);
    try {
      const payload: UpdateRoleRequest = {
        name: data.name.trim(),
        permissions: data.permissions,
      };
      await updateRole(id, payload);
      toast.success('Perfil atualizado com sucesso!');
      navigate(`${ROUTES.ROLES}/${id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao atualizar perfil';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => navigate(id ? `${ROUTES.ROLES}/${id}` : ROUTES.ROLES);

  return { role, loading, saving, error, setError, onSubmit, onCancel, reload: loadRole };
};
