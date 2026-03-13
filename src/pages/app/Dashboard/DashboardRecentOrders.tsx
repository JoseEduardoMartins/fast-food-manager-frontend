/**
 * DashboardRecentOrders
 * Exibe os últimos pedidos (requer orders.list)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Card,
  Title,
  Label,
  Button,
  Table,
  Badge,
  Icon,
} from '@components';
import type { Order } from '@services/orders';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  CONSUMPTION_MODE_LABELS,
} from '@common/constants/orderEnums';
import { ROUTES } from '@common/constants';
import { formatCurrency } from '@common/helpers';
import { useBranches } from '@common/hooks';
import { useDashboardRecentOrders } from './useDashboardRecentOrders';
import { ChevronRight } from 'lucide-react';

export const DashboardRecentOrders: React.FC = () => {
  const navigate = useNavigate();
  const { getBranchName } = useBranches();
  const { orders, loading, error } = useDashboardRecentOrders();

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (info) => {
        const id = info.getValue() as string;
        return <span className="font-mono text-sm">{id.slice(0, 8)}…</span>;
      },
    },
    {
      accessorKey: 'branchId',
      header: 'Filial',
      cell: (info) => getBranchName(info.getValue() as string),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as Order['status'];
        const variant =
          status === 'cancelled'
            ? 'error'
            : status === 'delivered'
              ? 'success'
              : 'default';
        return <Badge variant={variant}>{ORDER_STATUS_LABELS[status]}</Badge>;
      },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: (info) => formatCurrency(info.getValue() as number),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Pagamento',
      cell: (info) => {
        const method = info.getValue() as Order['paymentMethod'] | undefined;
        return method ? PAYMENT_METHOD_LABELS[method] : '-';
      },
    },
    {
      accessorKey: 'consumptionMode',
      header: 'Modo',
      cell: (info) => CONSUMPTION_MODE_LABELS[info.getValue() as Order['consumptionMode']],
    },
    {
      accessorKey: 'createdAt',
      header: 'Data',
      cell: (info) =>
        new Date(info.getValue() as string).toLocaleString('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
    },
  ];

  if (error) {
    return (
      <Card className="p-4 border-error bg-error/5">
        <Label className="text-error">{error}</Label>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Title variant="h3" className="font-semibold">
          Últimos Pedidos
        </Title>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.ORDERS)}
          className="gap-1"
        >
          Ver todos
          <Icon icon={ChevronRight} size={16} />
        </Button>
      </div>
      <Table
        data={orders}
        columns={columns}
        loading={loading}
        onRowClick={(row) => navigate(`${ROUTES.ORDERS}/${row.id}`)}
      />
    </Card>
  );
};
