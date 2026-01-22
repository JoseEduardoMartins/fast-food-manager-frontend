/**
 * useUserList Hook
 * Custom hook for user list page logic
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { listUsers, updateUser, deleteUser } from '@services/users';
import type { User, UserRole, ListUsersParams } from '@services/users';

export const useUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ListUsersParams = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      };

      if (selectedRole !== 'all') {
        params.role = selectedRole;
      }

      if (searchName) {
        params.name = searchName;
      }

      if (searchEmail) {
        params.email = searchEmail;
      }

      const response = await listUsers(params);
      
      setUsers(response.data);
      setPagination({
        total: response.total,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao carregar usuários';
      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, searchName, searchEmail, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (id: string, userName: string): Promise<void> => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o usuário "${userName}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(id);
      toast.success('Usuário excluído com sucesso!');
      await loadUsers();
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao excluir usuário';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      setError(null);
      await updateUser(user.id, { isActive: !user.isActive });
      toast.success(
        `Usuário ${user.isActive ? 'desativado' : 'ativado'} com sucesso!`
      );
      await loadUsers();
    } catch (err: any) {
      console.error('Erro ao alterar status do usuário:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao alterar status do usuário';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSearchEmail('');
    setSelectedRole('all');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return {
    users,
    loading,
    error,
    selectedRole,
    setSelectedRole,
    searchName,
    setSearchName,
    searchEmail,
    setSearchEmail,
    pagination,
    handleDelete,
    handleToggleActive,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
  };
};
