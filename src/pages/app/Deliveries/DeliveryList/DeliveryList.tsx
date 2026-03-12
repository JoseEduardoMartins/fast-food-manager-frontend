/**
 * DeliveryList Page
 * Gerenciamento de entregas - atribuir entregadores aos pedidos delivery
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  Card,
  Table,
  Button,
  Icon,
  Badge,
  Select,
} from '@components';
import { useAuth } from '@contexts';
import type { Order } from '@services/orders';
import type { User } from '@services/users';
import type { OrderStatus, OrderDeliveryStatus } from '@common/constants/orderEnums';
import { ROUTES } from '@common/constants';
import { ORDER_STATUS_LABELS, ORDER_DELIVERY_STATUS_LABELS } from '@common/constants/orderEnums';
import { formatCurrency } from '@common/helpers';
import { useDeliveryList } from './useDeliveryList';

const DeliveryList: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const { orders, deliveryUsers, loading, error, setError, assigning, assignDelivery } = useDeliveryList();

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Pedido',
        cell: (info) => {
          const id = info.getValue() as string;
          return <span className="font-mono text-xs">#{id.slice(0, 8)}</span>;
        },
      },
      {
        accessorKey: 'client',
        header: 'Cliente',
        cell: (info) => {
          const order = info.row.original;
          return order.client?.name || 'Sem cliente';
        },
      },
      {
        accessorKey: 'deliveryAddress',
        header: 'Endereço',
        cell: (info) => {
          const order = info.row.original;
          const addr = order.deliveryAddress;
          if (!addr) return 'Sem endereço';
          
          const line1 = `${addr.street}${addr.number ? ', ' + addr.number : ''}`;
          const line2 = addr.city && addr.state
            ? `${addr.city.name} - ${addr.state.shortName}`
            : null;
          
          return (
            <div className="text-sm">
              <div>{line1}</div>
              {line2 && <div className="text-gray-500">{line2}</div>}
            </div>
          );
        },
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: (info) => formatCurrency(info.getValue() as number),
      },
      {
        accessorKey: 'status',
        header: 'Status Pedido',
        cell: (info) => {
          const status = info.getValue() as OrderStatus;
          return <Badge variant="secondary">{ORDER_STATUS_LABELS[status]}</Badge>;
        },
      },
      {
        accessorKey: 'orderDelivery',
        header: 'Entrega',
        cell: (info) => {
          const order = info.row.original;
          const delivery = order.orderDelivery;

          if (!delivery) {
            return <Badge variant="default">Aguardando atribuição</Badge>;
          }

          return (
            <div className="space-y-1">
              <Badge variant="secondary">{ORDER_DELIVERY_STATUS_LABELS[delivery.status as OrderDeliveryStatus]}</Badge>
              <div className="text-xs text-gray-500">
                {delivery.deliveryUser?.name || 'Entregador'}
              </div>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-center">Ações</div>,
        cell: (info) => {
          const order = info.row.original;
          const hasDelivery = !!order.orderDelivery;

          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`${ROUTES.ORDERS}/${order.id}`);
                }}
                title="Ver detalhes"
              >
                <Icon icon={Eye} size={16} />
              </Button>

              {!hasDelivery && order.status === 'ready' && (
                <AssignDeliveryButton
                  orderId={order.id}
                  deliveryUsers={deliveryUsers}
                  onAssign={assignDelivery}
                  isAssigning={assigning === order.id}
                />
              )}
            </div>
          );
        },
      },
    ],
    [navigate, deliveryUsers, assignDelivery, assigning]
  );

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title="Gerenciar Entregas"
        description="Atribuir entregadores aos pedidos delivery"
      />

      <ErrorAlert message={error ?? ''} onDismiss={() => setError(null)} dismissible />

      <Card>
        <Table
          data={orders}
          columns={columns}
          loading={loading}
          onRowClick={(row) => navigate(`${ROUTES.ORDERS}/${row.id}`)}
        />
      </Card>
    </AppLayout>
  );
};

interface AssignDeliveryButtonProps {
  orderId: string;
  deliveryUsers: User[];
  onAssign: (orderId: string, userId: string) => void;
  isAssigning: boolean;
}

function AssignDeliveryButton({
  orderId,
  deliveryUsers,
  onAssign,
  isAssigning,
}: AssignDeliveryButtonProps) {
  const [selectedUserId, setSelectedUserId] = React.useState('');
  const [showSelect, setShowSelect] = React.useState(false);

  const handleAssign = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedUserId) {
      toast.error('Selecione um entregador');
      return;
    }
    onAssign(orderId, selectedUserId);
    setShowSelect(false);
    setSelectedUserId('');
  };

  if (!showSelect) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setShowSelect(true);
        }}
        title="Atribuir entregador"
        disabled={isAssigning}
      >
        <Icon icon={UserPlus} size={16} />
      </Button>
    );
  }

  return (
    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
      <Select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
        className="text-sm h-8"
        disabled={isAssigning}
      >
        <option value="">Selecione</option>
        {deliveryUsers.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </Select>
      <Button
        variant="default"
        size="sm"
        onClick={handleAssign}
        disabled={isAssigning || !selectedUserId}
        title="Confirmar"
      >
        ✓
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setShowSelect(false);
          setSelectedUserId('');
        }}
        disabled={isAssigning}
        title="Cancelar"
      >
        ✗
      </Button>
    </div>
  );
}

export default DeliveryList;
