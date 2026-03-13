/**
 * ProductList Page
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
import type { Product } from '@services/products';
import { ROUTES } from '@common/constants';
import { formatCurrency } from '@common/helpers';
import { useProductList } from './useProductList';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const {
    products,
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
  } = useProductList();

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'price',
        header: 'Preço',
        cell: (info) => formatCurrency(info.getValue() as number),
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
        meta: { align: 'center' as const },
        header: 'Ações',
        cell: (info) => {
          const product = info.row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.PRODUCTS_DETAILS.replace(':id', product.id));
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
                  navigate(ROUTES.PRODUCTS_EDIT.replace(':id', product.id));
                }}
                title="Editar produto"
              >
                <Icon icon={Edit} size={16} />
              </Button>
              <Button
                variant="error"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(product.id, product.name);
                }}
                title="Excluir produto"
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
        title="Produtos"
        description="Gerencie os produtos do cardápio"
        action={
          <Button onClick={() => navigate(ROUTES.PRODUCTS_CREATE)}>
            <Icon icon={Plus} size={16} className="mr-2" />
            Novo Produto
          </Button>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <FilterBar
        searchSlot={
          <FormField
            label="Buscar por nome"
            placeholder="Nome do produto..."
            value={searchName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && handleSearch()
            }
          />
        }
        filterContent={
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
        }
        onFilter={handleSearch}
        onClear={handleClearSearch}
        filterTitle="Filtros"
      />

      <Card>
        <Table
          data={products}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(ROUTES.PRODUCTS_DETAILS.replace(':id', row.id))}
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

export default ProductList;
