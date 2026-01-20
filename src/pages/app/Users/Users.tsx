/**
 * Users Management
 * CRUD for users - Content adapts based on user role
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Layout, Title, Label, Button, Card, Input, Select, Badge } from '@components';
import { useAuth } from '@contexts';
import { listUsers, createUser, updateUser, deleteUser } from '@services/users';
import type { User, CreateUserRequest, UpdateUserRequest, UserRole, ListUsersParams } from '@services/users';
import { ROUTES } from '@common/constants';

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  owner: 'Proprietário',
  manager: 'Gerente',
  cook: 'Cozinheiro',
  attendant: 'Atendente',
  customer: 'Cliente',
  delivery: 'Entregador',
};

// Roles that can be managed (only admin can see all, others see limited info)
const allowedRoles: UserRole[] = ['owner', 'manager', 'cook', 'attendant', 'customer'];

const Users: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  // Only admin can access full CRUD functionality
  if (!isAdmin) {
    return (
      <Layout
        headerProps={{
          onNavigate: (route) => navigate(route),
          user,
          isAuthenticated,
          onSignOut: signOut,
        }}
        footerProps={{
          onNavigate: (route) => navigate(route),
          user,
          isAuthenticated,
        }}
      >
        <div className="container py-8">
          <div className="text-center">
            <Title variant="h1" className="mb-4 text-foreground font-semibold">
              Acesso Negado
            </Title>
            <Label as="p" className="text-gray-600 dark:text-gray-400 mb-6">
              Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar usuários.
            </Label>
            <Button onClick={() => navigate(ROUTES.DASHBOARD)}>
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Load users
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
      
      // Filter to only show allowed roles
      const filteredData = response.data.filter((u) => allowedRoles.includes(u.role));
      
      setUsers(filteredData);
      setPagination({
        total: response.total,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err);
      setError(err.response?.data?.message || 'Erro ao carregar usuários');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, searchName, searchEmail, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await createUser(formData);
      toast.success('Usuário criado com sucesso!');
      setShowCreateModal(false);
      resetForm();
      await loadUsers();
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao criar usuário';
      setError(errorMessage);
      
      if (err.response?.status === 409) {
        toast.error('Email já está em uso');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setError(null);
      const updateData: UpdateUserRequest = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        ...(formData.password && { password: formData.password }),
      };
      await updateUser(editingUser.id, updateData);
      toast.success('Usuário atualizado com sucesso!');
      setEditingUser(null);
      resetForm();
      await loadUsers();
    } catch (err: any) {
      console.error('Erro ao atualizar usuário:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar usuário';
      setError(errorMessage);
      
      if (err.response?.status === 409) {
        toast.error('Email já está em uso');
      } else if (err.response?.status === 404) {
        toast.error('Usuário não encontrado');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    toast.custom((t) => (
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 max-w-md">
        <p className="font-semibold mb-2">Confirmar exclusão</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Tem certeza que deseja excluir o usuário <strong>{userName}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.dismiss(t)}
          >
            Cancelar
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={async () => {
              toast.dismiss(t);
              toast.promise(
                new Promise(async (resolve, reject) => {
                  try {
                    await deleteUser(id);
                    await loadUsers();
                    resolve(undefined);
                  } catch (err: any) {
                    console.error('Erro ao excluir usuário:', err);
                    const errorMessage = err.response?.data?.message || 'Erro ao excluir usuário';
                    setError(errorMessage);
                    reject(new Error(errorMessage));
                  }
                }),
                {
                  loading: 'Excluindo usuário...',
                  success: 'Usuário excluído com sucesso!',
                  error: (error: Error) => error.message || 'Erro ao excluir usuário',
                }
              );
            }}
          >
            Excluir
          </Button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  const handleToggleActive = async (userItem: User) => {
    try {
      setError(null);
      await updateUser(userItem.id, { isActive: !userItem.isActive });
      toast.success(
        `Usuário ${userItem.isActive ? 'desativado' : 'ativado'} com sucesso!`
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

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'customer',
    });
  };

  const openEditModal = (userItem: User) => {
    setEditingUser(userItem);
    setFormData({
      name: userItem.name,
      email: userItem.email,
      password: '',
      role: userItem.role,
    });
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingUser(null);
    resetForm();
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSearchEmail('');
    setSelectedRole('all');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <Layout
      headerProps={{
        onNavigate: (route) => navigate(route),
        user,
        isAuthenticated,
        onSignOut: signOut,
      }}
      footerProps={{
        onNavigate: (route) => navigate(route),
        user,
        isAuthenticated,
      }}
    >
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Title variant="h1" className="mb-2 text-foreground font-semibold">
              Gerenciamento de Usuários
            </Title>
            <Label as="p" className="text-gray-600 dark:text-gray-400">
              Gerencie proprietários, gerentes, cozinheiros, atendentes e clientes
            </Label>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>Novo Usuário</Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 p-4 bg-red-50 border-red-200">
            <Label className="text-red-600">{error}</Label>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="mb-2 block">Buscar por Nome</Label>
              <Input
                placeholder="Nome..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div>
              <Label className="mb-2 block">Buscar por Email</Label>
              <Input
                type="email"
                placeholder="Email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div>
              <Label className="mb-2 block">Filtrar por Tipo</Label>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
              >
                <option value="all">Todos</option>
                <option value="owner">Proprietários</option>
                <option value="manager">Gerentes</option>
                <option value="cook">Cozinheiros</option>
                <option value="attendant">Atendentes</option>
                <option value="customer">Clientes</option>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch}>Buscar</Button>
            <Button onClick={handleClearSearch} variant="outline">Limpar</Button>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          {loading ? (
            <div className="py-8 text-center text-gray-600 dark:text-gray-400">
              Carregando...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Tipo</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Data de Cadastro</th>
                      <th className="text-right py-3 px-4 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-600 dark:text-gray-400">
                          Nenhum usuário encontrado
                        </td>
                      </tr>
                    ) : (
                      users.map((userItem) => (
                        <tr
                          key={userItem.id}
                          className="border-b border-border hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="py-3 px-4">{userItem.name}</td>
                          <td className="py-3 px-4">{userItem.email}</td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary">{roleLabels[userItem.role]}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={userItem.isActive ? 'success' : 'error'}>
                              {userItem.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(userItem.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(userItem)}
                              >
                                Editar
                              </Button>
                              <Button
                                variant={userItem.isActive ? 'warning' : 'success'}
                                size="sm"
                                onClick={() => handleToggleActive(userItem)}
                              >
                                {userItem.isActive ? 'Desativar' : 'Ativar'}
                              </Button>
                              <Button
                                variant="error"
                                size="sm"
                                onClick={() => handleDelete(userItem.id, userItem.name)}
                              >
                                Excluir
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-4 py-4">
                  <Label className="text-sm text-gray-600 dark:text-gray-400">
                    Mostrando {users.length} de {pagination.total} usuários
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.pageIndex - 1)}
                      disabled={pagination.pageIndex === 0}
                    >
                      Anterior
                    </Button>
                    <Label className="flex items-center px-3 text-sm">
                      Página {pagination.pageIndex + 1} de {pagination.totalPages}
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.pageIndex + 1)}
                      disabled={pagination.pageIndex >= pagination.totalPages - 1}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* Create/Edit Modal */}
        {(showCreateModal || editingUser) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md p-6">
              <Title variant="h2" className="mb-4 font-semibold">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </Title>
              <form onSubmit={editingUser ? handleUpdate : handleCreate} className="space-y-4">
                <div>
                  <Label className="mb-2 block">Nome</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Email</Label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Senha</Label>
                  <Input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? 'Deixe em branco para manter a senha atual' : ''}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Tipo de Usuário</Label>
                  <Select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  >
                    <option value="owner">Proprietário</option>
                    <option value="manager">Gerente</option>
                    <option value="cook">Cozinheiro</option>
                    <option value="attendant">Atendente</option>
                    <option value="customer">Cliente</option>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingUser ? 'Salvar' : 'Criar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
