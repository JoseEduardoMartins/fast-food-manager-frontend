/**
 * DashboardRecentDeliveries
 * Exibe as últimas entregas (requer order-deliveries.list)
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
import type { OrderDelivery } from '@services/order-deliveries';
import { ORDER_DELIVERY_STATUS_LABELS } from '@common/constants/orderEnums';
import { ROUTES } from '@common/constants';
import { useDashboardRecentDeliveries } from './useDashboardRecentDeliveries';
import { ChevronRight } from 'lucide-react';

export const DashboardRecentDeliveries: React.FC = () => {
  const navigate = useNavigate();
  const { deliveries, loading, error } = useDashboardRecentDeliveries();

  const columns: ColumnDef<OrderDelivery>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (info) => (
        <span className="font-mono text-sm">
          {(info.getValue() as string).slice(0, 8)}…
        </span>
      ),
    },
    {
      accessorKey: 'orderId',
      header: 'Pedido',
      cell: (info) => (
        <span className="font-mono text-sm">
          {(info.getValue() as string).slice(0, 8)}…
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as OrderDelivery['status'];
        const variant =
          status === 'delivered'
            ? 'success'
            : status === 'failed'
              ? 'error'
              : 'default';
        return (
          <Badge variant={variant}>
            {ORDER_DELIVERY_STATUS_LABELS[status] ?? status}
          </Badge>
        );
      },
    },
    {
      id: 'deliveryUser',
      header: 'Entregador',
      cell: (info) => {
        const row = info.row.original;
        const user = row.deliveryUser;
        return user?.name ?? '-';
      },
    },
    {
      accessorKey: 'assignedAt',
      header: 'Atribuído em',
      cell: (info) => {
        const val = info.getValue() as string | undefined;
        return val
          ? new Date(val).toLocaleString('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'short',
            })
          : '-';
      },
    },
    {
      accessorKey: 'deliveredAt',
      header: 'Entregue em',
      cell: (info) => {
        const val = info.getValue() as string | undefined;
        return val
          ? new Date(val).toLocaleString('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'short',
            })
          : '-';
      },
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
          Últimas Entregas
        </Title>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.DELIVERIES)}
          className="gap-1"
        >
          Ver todas
          <Icon icon={ChevronRight} size={16} />
        </Button>
      </div>
      <Table
        data={deliveries}
        columns={columns}
        loading={loading}
        onRowClick={(row) => navigate(`${ROUTES.ORDERS}/${row.orderId}`)}
      />
    </Card>
  );
};
