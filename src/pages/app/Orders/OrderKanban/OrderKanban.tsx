/**
 * OrderKanban Page
 * Kanban de pedidos: colunas por status, visibilidade por role
 * admin/owner/manager: todas | cozinheiro: Recebido, Em preparo, Pronto | atendente/entrega: Pronto, Entregue
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import {
  AppLayout,
  PageHeader,
  ErrorAlert,
  Card,
  Button,
  Icon,
} from '@components';
import { useAuth } from '@contexts';
import type { Order } from '@services/orders';
import { CONSUMPTION_MODE_LABELS } from '@common/constants/orderEnums';
import { ROUTES } from '@common/constants';
import { useOrderKanban } from './useOrderKanban';
import { listBranches } from '@services/branches';
import type { Branch } from '@services/branches';

const formatMoney = (centavos: number) =>
  `R$ ${(centavos / 100).toFixed(2).replace('.', ',')}`;

const OrderKanban: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);

  const {
    columns,
    ordersByStatus,
    loading,
    error,
    setError,
    updateStatus,
    moveToNextStatus,
    updatingId,
    userRole,
  } = useOrderKanban();

  const canCreateOrder =
    userRole === 'admin' || userRole === 'owner' || userRole === 'manager';

  useEffect(() => {
    listBranches({ pageSize: 200, sort: { fields: ['name'], order: ['ASC'] } })
      .then((res) => setBranches(res.data))
      .catch(() => setBranches([]));
  }, []);

  const getBranchName = (branchId: string) =>
    branches.find((b) => b.id === branchId)?.name ?? branchId.slice(0, 8) + '…';

  return (
    <AppLayout user={currentUser} onSignOut={signOut}>
      <PageHeader
        title="Pedidos"
        description="Acompanhe os pedidos por etapa do processo"
        action={
          canCreateOrder ? (
            <Button onClick={() => navigate(ROUTES.ORDERS_CREATE)}>
              <Icon icon={Plus} size={16} className="mr-2" />
              Novo pedido
            </Button>
          ) : undefined
        }
      />

      <ErrorAlert
        message={error ?? ''}
        onDismiss={() => setError(null)}
        dismissible
      />

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => (
            <Card key={col.status} className="min-w-[280px] shrink-0 p-4">
              <h3 className="font-semibold text-foreground mb-3">{col.label}</h3>
              <div className="text-muted-foreground text-sm">Carregando...</div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const orders = ordersByStatus[col.status] ?? [];
            return (
              <Card
                key={col.status}
                className="min-w-[280px] w-[280px] shrink-0 flex flex-col max-h-[calc(100vh-12rem)]"
              >
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{col.label}</h3>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {orders.length}
                  </span>
                </div>
                <div className="p-2 flex-1 overflow-y-auto space-y-2">
                  {orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      Nenhum pedido
                    </p>
                  ) : (
                    orders.map((order) => {
                      const next = moveToNextStatus(order);
                      return (
                        <OrderCard
                          key={order.id}
                          order={order}
                          branchName={getBranchName(order.branchId)}
                          nextStatus={next}
                          onMoveToNext={
                            next
                              ? () => updateStatus(order.id, next)
                              : undefined
                          }
                          onView={() =>
                            navigate(ROUTES.ORDERS_DETAILS.replace(':id', order.id))
                          }
                          isUpdating={updatingId === order.id}
                        />
                      );
                    })
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};

function OrderCard({
  order,
  branchName,
  nextStatus,
  onMoveToNext,
  onView,
  isUpdating,
}: {
  order: Order;
  branchName: string;
  nextStatus: string | null;
  onMoveToNext?: () => void;
  onView: () => void;
  isUpdating: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 shadow-sm hover:border-primary/50 transition-colors">
      <button
        type="button"
        onClick={onView}
        className="w-full text-left block"
      >
        <p className="font-mono text-xs text-muted-foreground mb-1">
          #{order.id.slice(0, 8)}
        </p>
        <p className="font-medium text-foreground">{formatMoney(order.total)}</p>
        <p className="text-xs text-muted-foreground mt-1">{branchName}</p>
        <p className="text-xs text-muted-foreground">
          {CONSUMPTION_MODE_LABELS[order.consumptionMode]}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(order.createdAt).toLocaleString('pt-BR')}
        </p>
      </button>
      {nextStatus && onMoveToNext && (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={(e) => {
            e.stopPropagation();
            onMoveToNext();
          }}
          disabled={isUpdating}
        >
          {isUpdating ? (
            '...'
          ) : (
            <>
              Próximo
              <Icon icon={ChevronRight} size={14} className="ml-1" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default OrderKanban;
