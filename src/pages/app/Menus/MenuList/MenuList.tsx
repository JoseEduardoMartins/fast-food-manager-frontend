/**
 * MenuList Page
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
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
import type { Menu } from '@services/menus';
import { ROUTES } from '@common/constants';
import { useMenuList } from './useMenuList';

const MenuList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const {
    menus,
    loading,
    error,
    searchName,
    setSearchName,
    selectedStatus,
    setSelectedStatus,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
  } = useMenuList();

  const columns = useMemo<ColumnDef<Menu>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        cell: (info) => info.getValue(),
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
        header: 'Data de cadastro',
        cell: (info) => {
          const date = info.getValue() as string | undefined;
          return date ? new Date(date).toLocaleDateString('pt-BR') : '-';
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-center">Ações</div>,
        cell: (info) => {
          const menu = info.row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.MENUS_DETAILS.replace(':id', menu.id));
                }}
                title="Ver detalhes"
              >
                <Icon icon={Eye} size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.MENUS_EDIT.replace(':id', menu.id));
                }}
                title="Editar menu"
              >
                <Icon icon={Edit} size={16} />
              </Button>
              <Button
                variant="error"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(menu.id, menu.name);
                }}
                title="Excluir menu"
              >
                <Icon icon={Trash2} size={16} />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDelete, navigate]
  );

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title="Menus"
        description="Gerencie os menus e cardápios"
        action={
          <Button onClick={() => navigate(ROUTES.MENUS_CREATE)}>
            <Icon icon={Plus} size={16} className="mr-2" />
            Novo Menu
          </Button>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <FilterForm onSearch={handleSearch} onClear={handleClearSearch}>
        <FormField
          label="Buscar por nome"
          placeholder="Nome do menu..."
          value={searchName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === 'Enter' && handleSearch()
          }
        />
        <div>
          <Label className="mb-2 block">Status</Label>
          <Select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive')
            }
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </Select>
        </div>
      </FilterForm>

      <Card>
        <Table
          data={menus}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(ROUTES.MENUS_DETAILS.replace(':id', row.id))}
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

export default MenuList;
