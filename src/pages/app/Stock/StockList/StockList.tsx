/**
 * StockList Page
 * List branch-ingredients (stock per branch) with level % and color by stock level
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, ArrowDownUp } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
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
import type { BranchIngredient } from '@services/branch-ingredients';
import { ROUTES } from '@common/constants';
import { useStockList } from './useStockList';

const formatPrice = (centavos: number) =>
  `R$ ${(centavos / 100).toFixed(2).replace('.', ',')}`;

/** Porcentagem em relação ao mínimo (100% = no mínimo). Cor: crítico < 100%, atenção 100–120%, OK > 120% */
function stockLevelPercent(quantity: number, minQuantity: number): number | null {
  if (minQuantity <= 0) return null;
  return Math.round((quantity / minQuantity) * 100);
}

function StockLevelCell({ row }: { row: BranchIngredient }) {
  const percent = stockLevelPercent(row.stockQuantity, row.stockMinQuantity);
  if (percent === null) return <span className="text-muted-foreground">—</span>;
  const critical = percent < 100;
  const warning = percent >= 100 && percent <= 120;
  const variant = critical ? 'error' : warning ? 'warning' : 'success';
  const label =
    percent < 100
      ? `Crítico (${percent}% do mínimo) — comprar já`
      : percent <= 120
        ? `Atenção (${percent}% do mínimo) — repor em breve`
        : `OK (${percent}% do mínimo)`;
  return (
    <Badge variant={variant} title={label}>
      {percent}%
    </Badge>
  );
}

const StockList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const {
    items,
    branches,
    loading,
    error,
    selectedBranchId,
    setSelectedBranchId,
    pagination,
    handleDelete,
    handlePageChange,
    handleFilter,
    setError,
    getBranchName,
    getIngredientName,
  } = useStockList();

  const columns = useMemo<ColumnDef<BranchIngredient>[]>(
    () => [
      {
        accessorKey: 'branchId',
        header: 'Filial',
        cell: (info) => getBranchName(info.getValue() as string),
      },
      {
        accessorKey: 'ingredientId',
        header: 'Ingrediente',
        cell: (info) => getIngredientName(info.getValue() as number),
      },
      {
        accessorKey: 'stockQuantity',
        header: 'Quantidade',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'stockMinQuantity',
        header: 'Est. mínimo',
        cell: (info) => info.getValue(),
      },
      {
        id: 'level',
        header: 'Nível',
        cell: (info) => <StockLevelCell row={info.row.original} />,
      },
      {
        accessorKey: 'purchasePrice',
        header: 'Preço compra',
        cell: (info) => formatPrice(info.getValue() as number),
      },
      {
        accessorKey: 'salePrice',
        header: 'Preço venda',
        cell: (info) => {
          const v = info.getValue() as number | undefined;
          return v != null ? formatPrice(v) : '-';
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-center">Ações</div>,
        cell: (info) => {
          const row = info.row.original;
          const label = `${getBranchName(row.branchId)} / ${getIngredientName(row.ingredientId)}`;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.STOCK_DETAILS.replace(':id', row.id));
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
                  navigate(ROUTES.STOCK_EDIT.replace(':id', row.id));
                }}
                title="Editar"
              >
                <Icon icon={Edit} size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${ROUTES.STOCK_MOVEMENT}?branchId=${row.branchId}&ingredientId=${row.ingredientId}`);
                }}
                title="Movimentar"
              >
                <Icon icon={ArrowDownUp} size={16} />
              </Button>
              <Button
                variant="error"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row.id, label);
                }}
                title="Excluir"
              >
                <Icon icon={Trash2} size={16} />
              </Button>
            </div>
          );
        },
      },
    ],
    [getBranchName, getIngredientName, handleDelete, navigate]
  );

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title="Estoque"
        description="Acompanhe o nível de estoque por filial e veja o que precisa repor"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(ROUTES.STOCK_MOVEMENT)}>
              <Icon icon={ArrowDownUp} size={16} className="mr-2" />
              Nova movimentação
            </Button>
            <Button onClick={() => navigate(ROUTES.STOCK_CREATE)}>
              <Icon icon={Plus} size={16} className="mr-2" />
              Novo registro
            </Button>
          </div>
        }
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <Label className="mb-2 block">Filial</Label>
            <Select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
            >
              <option value="all">Todas</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </div>
          <Button onClick={handleFilter}>Filtrar</Button>
        </div>
      </Card>

      <Card>
        <Table
          data={items}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(ROUTES.STOCK_DETAILS.replace(':id', row.id))}
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

export default StockList;
