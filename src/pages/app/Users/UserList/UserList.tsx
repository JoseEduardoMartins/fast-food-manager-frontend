/**
 * UserList Page
 * Lists all users with filtering, search, and pagination
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Lock } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  FilterBar,
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
import { PERMISSIONS } from '@common/constants/permissions';
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
  const { user: currentUser, signOut, hasPermission } = useAuth();

  const canCreate = hasPermission(PERMISSIONS.users.create);
  const canUpdate = hasPermission(PERMISSIONS.users.update);
  const canDelete = hasPermission(PERMISSIONS.users.delete);
  
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
        header: 'Perfil de Acesso',
        cell: (info) => {
          const user = info.row.original;
          const role = user.role;
          
          // Se role for objeto (RBAC do backend)
          if (typeof role === 'object' && role !== null) {
            return (
              <div className="flex items-center gap-2">
                <Badge variant={role.isSystem ? 'secondary' : 'default'}>
                  {role.name}
                </Badge>
                {role.isSystem && (
                  <Icon icon={Lock} size={14} className="text-gray-500" title="Perfil do sistema" />
                )}
              </div>
            );
          }
          
          // Fallback para enum legacy (se ainda houver)
          if (typeof role === 'string') {
            return <Badge variant="secondary">{roleLabels[role as UserRole] || role}</Badge>;
          }
          
          return <Badge variant="error">Sem perfil</Badge>;
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
        meta: { align: 'center' as const },
        header: 'Ações',
        cell: (info) => {
          const user = info.row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${ROUTES.USERS}/${user.id}`);
                }}
                title="Ver detalhes"
              >
                <Icon icon={Eye} size={16} />
              </Button>
              {canUpdate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`${ROUTES.USERS}/${user.id}/edit`);
                  }}
                  title="Editar usuário"
                >
                  <Icon icon={Edit} size={16} />
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="error"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user.id, user.name);
                  }}
                  title="Excluir usuário"
                >
                  <Icon icon={Trash2} size={16} />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [canUpdate, canDelete, handleDelete, navigate]
  );

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title="Gerenciamento de Usuários"
        description="Gerencie proprietários, gerentes, cozinheiros, atendentes e clientes"
        action={
          canCreate ? (
            <Button onClick={() => navigate(ROUTES.USERS_CREATE)}>
              <Icon icon={Plus} size={16} className="mr-2" />
              Novo Usuário
            </Button>
          ) : null
        }
      />

      <ErrorAlert message={error || ''} onDismiss={() => setError(null)} dismissible />

      <FilterBar
        searchSlot={
          <FormField
            label="Buscar por Nome"
            placeholder="Nome..."
            value={searchName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
          />
        }
        filterContent={
          <>
            <FormField
              label="Buscar por Email"
              type="email"
              placeholder="Email..."
              value={searchEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchEmail(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
            />
            <div>
              <Label className="mb-2 block">Perfil</Label>
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
          </>
        }
        onFilter={handleSearch}
        onClear={handleClearSearch}
        filterTitle="Filtros"
      />

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
