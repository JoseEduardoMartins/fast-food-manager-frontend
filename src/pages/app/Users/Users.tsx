/**
 * Users Management
 * CRUD for users - Content adapts based on user role
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Layout, Title, Label, Button, Card, Select, Badge, Table, TablePagination, Icon, PageHeader, ErrorAlert, FilterForm, Modal, FormField } from '@components';
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

  // Define table columns
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'role',
        header: 'Tipo',
        cell: (info) => {
          const role = info.getValue() as UserRole;
          return <Badge variant="secondary">{roleLabels[role]}</Badge>;
        },
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: (info) => {
          const isActive = info.getValue() as boolean;
          return (
            <Badge variant={isActive ? 'success' : 'error'}>
              {isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Data de Cadastro',
        cell: (info) => {
          const date = info.getValue() as string;
          return new Date(date).toLocaleDateString('pt-BR');
        },
      },
      {
        id: 'actions',
        header: 'Ações',
        cell: (info) => {
          const user = info.row.original;
          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(user);
                }}
              >
                <Icon icon={Edit} size={14} className="mr-1" />
                Editar
              </Button>
              <Button
                variant={user.isActive ? 'warning' : 'success'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleActive(user);
                }}
              >
                <Icon icon={user.isActive ? UserX : UserCheck} size={14} className="mr-1" />
                {user.isActive ? 'Desativar' : 'Ativar'}
              </Button>
              <Button
                variant="error"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(user.id, user.name);
                }}
              >
                <Icon icon={Trash2} size={14} className="mr-1" />
                Excluir
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

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
        <PageHeader
          title="Gerenciamento de Usuários"
          description="Gerencie proprietários, gerentes, cozinheiros, atendentes e clientes"
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              <Icon icon={Plus} size={16} className="mr-2" />
              Novo Usuário
            </Button>
          }
        />

        {/* Error Message */}
        <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

        {/* Filters */}
        <FilterForm onSearch={handleSearch} onClear={handleClearSearch}>
          <FormField
            label="Buscar por Nome"
            placeholder="Nome..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <FormField
            label="Buscar por Email"
            type="email"
            placeholder="Email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
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
        </FilterForm>

        {/* Users Table */}
        <Card>
          <Table
            data={users}
            columns={columns}
            loading={loading}
          />
          <TablePagination
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={handlePageChange}
            showPagination={pagination.totalPages > 1}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          isOpen={showCreateModal || !!editingUser}
          onClose={closeModal}
          title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        >
          <form onSubmit={editingUser ? handleUpdate : handleCreate} className="space-y-4">
            <FormField
              label="Nome"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <FormField
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FormField
              label="Senha"
              type="password"
              required={!editingUser}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={editingUser ? 'Deixe em branco para manter a senha atual' : ''}
              helperText={editingUser ? 'Deixe em branco para manter a senha atual' : undefined}
            />
            <div>
              <Label className="mb-2 block">
                Tipo de Usuário
                <span className="text-error ml-1">*</span>
              </Label>
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
        </Modal>
      </div>
    </Layout>
  );
};

export default Users;