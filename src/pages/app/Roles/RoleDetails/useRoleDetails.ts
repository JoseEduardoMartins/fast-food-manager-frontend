/**
 * useRoleDetails Hook
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getRoleById, deleteRole } from '@services/roles';
import type { Role } from '@services/roles';
import { ROUTES } from '@common/constants';

export const useRoleDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
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
      const msg = e.response?.data?.message ?? 'Erro ao carregar perfil';
      setError(msg);
      toast.error(msg);
      navigate(ROUTES.ROLES);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!role) return;
    if (role.isSystem) {
      toast.error('Perfis do sistema não podem ser excluídos.');
      return;
    }
    if (!window.confirm(`Excluir o perfil "${role.name}"?`)) return;
    try {
      await deleteRole(role.id);
      toast.success('Perfil excluído com sucesso!');
      navigate(ROUTES.ROLES);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message ?? 'Erro ao excluir perfil');
    }
  };

  const handleEdit = () => {
    if (role && !role.isSystem) navigate(`${ROUTES.ROLES}/${role.id}/edit`);
  };

  const handleBack = () => navigate(ROUTES.ROLES);

  return { role, loading, error, setError, handleDelete, handleEdit, handleBack, reload: loadRole };
};
