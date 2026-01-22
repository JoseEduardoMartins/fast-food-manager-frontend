/**
 * UserList Page
 * Lists all users with filtering, search, and pagination
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, UserCheck, UserX, Eye } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  FilterForm,
  FormField,
  Label,
  Select,
  Card,
  Table,
  TablePagination,
  Button,
  Icon,
  Badge,
} from '@components';
import { useAuth } from '@contexts';
import type { User, UserRole } from '@services/users';
import { ROUTES } from '@common/constants';
import { useUserList } from './useUserList';

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  owner: 'Proprietário',
  manager: 'Gerente',
  cook: 'Cozinheiro',
  attendant: 'Atendente',
  customer: 'Cliente',
  delivery: 'Entregador',
};

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  
  const {
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
  } = useUserList();

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
                  navigate(`${ROUTES.USERS}/${user.id}`);
                }}
              >
                <Icon icon={Eye} size={14} className="mr-1" />
                Ver
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${ROUTES.USERS}/${user.id}/edit`);
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
    [handleDelete, handleToggleActive, navigate]
  );

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title="Gerenciamento de Usuários"
        description="Gerencie proprietários, gerentes, cozinheiros, atendentes e clientes"
        action={
          <Button onClick={() => navigate(ROUTES.USERS_CREATE)}>
            <Icon icon={Plus} size={16} className="mr-2" />
            Novo Usuário
          </Button>
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <FilterForm onSearch={handleSearch} onClear={handleClearSearch}>
        <FormField
          label="Buscar por Nome"
          placeholder="Nome..."
          value={searchName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
        />
        <FormField
          label="Buscar por Email"
          type="email"
          placeholder="Email..."
          value={searchEmail}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchEmail(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
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

      <Card>
        <Table
          data={users}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(`${ROUTES.USERS}/${row.id}`)}
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
    </AppLayout>
  );
};

export default UserList;
