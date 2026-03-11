/**
 * OrderList Page
 * Lists all orders with filtering and pagination
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
import type { Order } from '@services/orders';
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  CONSUMPTION_MODE_LABELS,
} from '@common/constants/orderEnums';
import { ROUTES } from '@common/constants';
import { useOrderList } from './useOrderList';
import { listBranches } from '@services/branches';
import type { Branch } from '@services/branches';
import { useState, useEffect } from 'react';

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);

  const {
    orders,
    loading,
    error,
    selectedBranch,
    setSelectedBranch,
    selectedStatus,
    setSelectedStatus,
    selectedPayment,
    setSelectedPayment,
    selectedConsumption,
    setSelectedConsumption,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
  } = useOrderList();

  useEffect(() => {
    listBranches({ pageSize: 200, sort: { fields: ['name'], order: ['ASC'] } })
      .then((res) => setBranches(res.data))
      .catch(() => setBranches([]));
  }, []);

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => {
          const id = info.getValue() as string;
          return id.slice(0, 8) + '…';
        },
      },
      {
        accessorKey: 'branchId',
        header: 'Filial',
        cell: (info) => {
          const branchId = info.getValue() as string;
          const branch = branches.find((b) => b.id === branchId);
          return branch?.name ?? branchId.slice(0, 8) + '…';
        },
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
          return (
            <Badge variant={variant}>{ORDER_STATUS_LABELS[status]}</Badge>
          );
        },
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: (info) => {
          const total = info.getValue() as number;
          return `R$ ${(total / 100).toFixed(2).replace('.', ',')}`;
        },
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
        cell: (info) => {
          const mode = info.getValue() as Order['consumptionMode'];
          return CONSUMPTION_MODE_LABELS[mode];
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Data',
        cell: (info) => {
          const date = info.getValue() as string;
          return new Date(date).toLocaleString('pt-BR');
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-center">Ações</div>,
        cell: (info) => {
          const order = info.row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(ROUTES.ORDERS_DETAILS.replace(':id', order.id));
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
                  navigate(ROUTES.ORDERS_EDIT.replace(':id', order.id));
                }}
                title="Editar pedido"
              >
                <Icon icon={Edit} size={16} />
              </Button>
              <Button
                variant="error"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(order.id, `#${order.id.slice(0, 8)}`);
                }}
                title="Excluir pedido"
              >
                <Icon icon={Trash2} size={16} />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDelete, navigate, branches]
  );

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title="Pedidos"
        description="Gerencie os pedidos do sistema"
        action={
          <Button onClick={() => navigate(ROUTES.ORDERS_CREATE)}>
            <Icon icon={Plus} size={16} className="mr-2" />
            Novo Pedido
          </Button>
        }
      />

      <ErrorAlert
        message={error ?? ''}
        onDismiss={() => setError(null)}
        dismissible
      />

      <FilterForm onSearch={handleSearch} onClear={handleClearSearch}>
        <div>
          <Label className="mb-2 block">Filial</Label>
          <Select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="all">Todas</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="mb-2 block">Status</Label>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="mb-2 block">Pagamento</Label>
          <Select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
          >
            <option value="all">Todos</option>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label className="mb-2 block">Modo de consumo</Label>
          <Select
            value={selectedConsumption}
            onChange={(e) => setSelectedConsumption(e.target.value)}
          >
            <option value="all">Todos</option>
            {Object.entries(CONSUMPTION_MODE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </FilterForm>

      <Card>
        <Table
          data={orders}
          columns={columns}
          loading={loading}
          onRowClick={(row) =>
            navigate(ROUTES.ORDERS_DETAILS.replace(':id', row.id))
          }
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

export default OrderList;
