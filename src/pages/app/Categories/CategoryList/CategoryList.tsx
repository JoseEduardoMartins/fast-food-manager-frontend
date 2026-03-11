/**
 * CategoryList Page
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
import type { Category } from '@services/categories';
import { ROUTES } from '@common/constants';
import { useCategoryList } from './useCategoryList';

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const {
    categories,
    menus,
    loading,
    error,
    searchName,
    setSearchName,
    selectedMenuId,
    setSelectedMenuId,
    selectedStatus,
    setSelectedStatus,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
    getMenuNameById,
  } = useCategoryList();

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        cell: (info) => info.getValue(),
      },
      {
        id: 'menuName',
        header: 'Menu',
        cell: (info) => {
          const cat = info.row.original;
          return getMenuNameById(cat.menuId);
        },
      },
      {
        accessorKey: 'order',
        header: 'Ordem',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: (info) => {
          const isActive = info.getValue() as boolean;
          return (
            <Badge variant={isActive ? 'success' : 'error'}>
              {isActive ? 'Ativa' : 'Inativa'}
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
          const category = info.row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.CATEGORIES_DETAILS.replace(':id', category.id));
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
                  navigate(ROUTES.CATEGORIES_EDIT.replace(':id', category.id));
                }}
                title="Editar categoria"
              >
                <Icon icon={Edit} size={16} />
              </Button>
              <Button
                variant="error"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(category.id, category.name);
                }}
                title="Excluir categoria"
              >
                <Icon icon={Trash2} size={16} />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDelete, navigate, getMenuNameById]
  );

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title="Categorias de menu"
        description="Gerencie as categorias dos menus"
        action={
          <Button onClick={() => navigate(ROUTES.CATEGORIES_CREATE)}>
            <Icon icon={Plus} size={16} className="mr-2" />
            Nova categoria
          </Button>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <FilterForm onSearch={handleSearch} onClear={handleClearSearch}>
        <FormField
          label="Buscar por nome"
          placeholder="Nome da categoria..."
          value={searchName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === 'Enter' && handleSearch()
          }
        />
        <div>
          <Label className="mb-2 block">Menu</Label>
          <Select
            value={selectedMenuId}
            onChange={(e) => setSelectedMenuId(e.target.value)}
          >
            <option value="">Todos os menus</option>
            {menus.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="mb-2 block">Status</Label>
          <Select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive')
            }
          >
            <option value="all">Todas</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </Select>
        </div>
      </FilterForm>

      <Card>
        <Table
          data={categories}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(ROUTES.CATEGORIES_DETAILS.replace(':id', row.id))}
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

export default CategoryList;
