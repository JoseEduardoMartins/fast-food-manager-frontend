/**
 * IngredientList Page
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
} from '@components';
import { useAuth } from '@contexts';
import type { Ingredient } from '@services/ingredients';
import { ROUTES } from '@common/constants';
import { useIngredientList } from './useIngredientList';

const IngredientList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const {
    ingredients,
    loading,
    error,
    searchName,
    setSearchName,
    selectedUnit,
    setSelectedUnit,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
  } = useIngredientList();

  const columns = useMemo<ColumnDef<Ingredient>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'description',
        header: 'Descrição',
        cell: (info) => {
          const desc = info.getValue() as string | undefined;
          return desc ? (desc.length > 50 ? desc.slice(0, 50) + '…' : desc) : '-';
        },
      },
      {
        accessorKey: 'unit',
        header: 'Unidade',
        cell: (info) => {
          const unit = info.getValue() as string;
          const labels: Record<string, string> = { g: 'g', kg: 'kg', ml: 'ml', L: 'L', un: 'un.' };
          return labels[unit] ?? unit;
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
          const ingredient = info.row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.INGREDIENTS_DETAILS.replace(':id', String(ingredient.id)));
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
                  navigate(ROUTES.INGREDIENTS_EDIT.replace(':id', String(ingredient.id)));
                }}
                title="Editar ingrediente"
              >
                <Icon icon={Edit} size={16} />
              </Button>
              <Button
                variant="error"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(ingredient.id, ingredient.name);
                }}
                title="Excluir ingrediente"
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
        title="Ingredientes"
        description="Gerencie os ingredientes do cardápio"
        action={
          <Button onClick={() => navigate(ROUTES.INGREDIENTS_CREATE)}>
            <Icon icon={Plus} size={16} className="mr-2" />
            Novo Ingrediente
          </Button>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <FilterBar
        searchSlot={
          <FormField
            label="Buscar por nome"
            placeholder="Nome do ingrediente..."
            value={searchName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === 'Enter' && handleSearch()
            }
          />
        }
        filterContent={
          <div>
            <Label className="mb-2 block">Unidade</Label>
            <Select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value as typeof selectedUnit)}
            >
              <option value="all">Todas</option>
              <option value="g">Gramas (g)</option>
              <option value="kg">Quilogramas (kg)</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="L">Litros (L)</option>
              <option value="un">Unidade (un)</option>
            </Select>
          </div>
        }
        onFilter={handleSearch}
        onClear={handleClearSearch}
        filterTitle="Filtros"
      />

      <Card>
        <Table
          data={ingredients}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(ROUTES.INGREDIENTS_DETAILS.replace(':id', String(row.id)))}
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

export default IngredientList;
