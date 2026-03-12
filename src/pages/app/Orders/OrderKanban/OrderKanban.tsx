/**
 * OrderKanban Page
 * Kanban de pedidos: colunas por status, visibilidade por role
 * admin/owner/manager: todas | cozinheiro: Recebido, Em preparo, Pronto | atendente/entrega: Pronto, Entregue
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, XCircle } from 'lucide-react';
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
import { formatCurrency } from '@common/helpers';
import { useBranches } from '@common/hooks';
import { useOrderKanban } from './useOrderKanban';

const OrderKanban: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser, signOut } = useAuth();
  const { getBranchName } = useBranches();

  const {
    columns,
    ordersByStatus,
    loading,
    error,
    setError,
    updateStatus,
    cancelOrder,
    moveToNextStatus,
    updatingId,
    userRole,
  } = useOrderKanban();

  const canCreateOrder =
    userRole === 'admin' || userRole === 'owner' || userRole === 'manager';

  const canCancelOrder =
    userRole === 'admin' ||
    userRole === 'owner' ||
    userRole === 'manager' ||
    userRole === 'attendant';

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
        <div className="w-full min-w-0 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {columns.map((col) => (
              <Card key={col.status} className="min-w-[280px] shrink-0 p-4">
                <h3 className="font-semibold text-foreground mb-3">{col.label}</h3>
                <div className="text-muted-foreground text-sm">Carregando...</div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full min-w-0 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
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
                  <div className="p-2 flex-1 overflow-y-auto space-y-2 min-h-0">
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
                            onCancel={
                              canCancelOrder
                                ? () => cancelOrder(order.id)
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
  onCancel,
  onView,
  isUpdating,
}: {
  order: Order;
  branchName: string;
  nextStatus: string | null;
  onMoveToNext?: () => void;
  onCancel?: () => void;
  onView: () => void;
  isUpdating: boolean;
}) {
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Cancelar este pedido? Esta ação não pode ser desfeita.')) {
      onCancel?.();
    }
  };

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
        <p className="font-medium text-foreground">{formatCurrency(order.total)}</p>
        <p className="text-xs text-muted-foreground mt-1">{branchName}</p>
        <p className="text-xs text-muted-foreground">
          {CONSUMPTION_MODE_LABELS[order.consumptionMode]}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(order.createdAt).toLocaleString('pt-BR')}
        </p>
      </button>
      <div className="flex flex-col gap-1.5 mt-2">
        {nextStatus && onMoveToNext && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
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
        {onCancel && (
          <Button
            variant="error"
            size="sm"
            className="w-full"
            onClick={handleCancel}
            disabled={isUpdating}
            title="Cancelar pedido"
          >
            <Icon icon={XCircle} size={14} className="mr-1" />
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}

export default OrderKanban;
