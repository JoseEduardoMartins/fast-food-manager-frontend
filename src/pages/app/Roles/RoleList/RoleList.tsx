/**
 * RoleList Page
 * Lista perfis de acesso (roles) com CRUD
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
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
import type { Role } from '@services/roles';
import { ROUTES } from '@common/constants';
import { PERMISSIONS } from '@common/constants/permissions';
import { useRoleList } from './useRoleList';

const RoleList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut, hasPermission } = useAuth();
  const {
    roles,
    loading,
    error,
    setError,
    searchName,
    setSearchName,
    selectedType,
    setSelectedType,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
  } = useRoleList();

  const canCreate = hasPermission(PERMISSIONS.roles.create);
  const canUpdate = hasPermission(PERMISSIONS.roles.update);
  const canDelete = hasPermission(PERMISSIONS.roles.delete);

  const columns = useMemo<ColumnDef<Role>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'isSystem',
        header: 'Tipo',
        cell: (info) => {
          const isSystem = info.getValue() as boolean | undefined;
          return (
            <Badge variant={isSystem ? 'secondary' : 'default'}>
              {isSystem ? 'Sistema' : 'Customizado'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'permissions',
        header: 'Permissões',
        cell: (info) => {
          const perms = info.getValue() as string[] | undefined;
          const count = perms?.length ?? 0;
          return <span>{count} permissão(ões)</span>;
        },
      },
      {
        id: 'actions',
        meta: { align: 'center' as const },
        header: 'Ações',
        cell: (info) => {
          const role = info.row.original;
          const canEdit = canUpdate && !role.isSystem;
          const canDel = canDelete && !role.isSystem;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${ROUTES.ROLES}/${role.id}`);
                }}
                title="Ver detalhes"
              >
                <Icon icon={Eye} size={16} />
              </Button>
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`${ROUTES.ROLES}/${role.id}/edit`);
                  }}
                  title="Editar perfil"
                >
                  <Icon icon={Edit} size={16} />
                </Button>
              )}
              {canDel && (
                <Button
                  variant="error"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(role.id, role.name);
                  }}
                  title="Excluir perfil"
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
        title="Perfis de Acesso"
        description="Gerencie perfis e permissões do sistema"
        action={
          canCreate ? (
            <Button onClick={() => navigate(ROUTES.ROLES_CREATE)}>
              <Icon icon={Plus} size={16} className="mr-2" />
              Novo Perfil
            </Button>
          ) : null
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <FilterBar
        searchSlot={
          <FormField
            label="Buscar por nome"
            placeholder="Nome do perfil..."
            value={searchName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && handleSearch()
            }
          />
        }
        filterContent={
          <div>
            <Label className="mb-2 block">Tipo</Label>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
            >
              <option value="all">Todos</option>
              <option value="system">Sistema</option>
              <option value="custom">Customizado</option>
            </Select>
          </div>
        }
        onFilter={handleSearch}
        onClear={handleClearSearch}
        filterTitle="Filtros"
      />

      <Card>
        <Table
          data={roles}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(`${ROUTES.ROLES}/${row.id}`)}
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

export default RoleList;
