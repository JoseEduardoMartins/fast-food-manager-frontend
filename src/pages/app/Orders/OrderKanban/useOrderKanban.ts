/**
 * useOrderKanban Hook
 * Carrega pedidos e agrupa por status; colunas visíveis conforme o role do usuário
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@contexts';
import { listOrders, updateOrder } from '@services/orders';
import type { Order } from '@services/orders';
import type { OrderStatus } from '@common/constants/orderEnums';
import {
  getOrderKanbanColumnsForRole,
  ORDER_STATUS_EXCLUDED_FROM_KANBAN,
  type OrderKanbanRole,
} from '@common/constants/orderEnums';

export type OrdersByStatus = Partial<Record<OrderStatus, Order[]>>;

export const useOrderKanban = () => {
  const { user } = useAuth();
  const userRole = (user?.role ?? 'attendant') as OrderKanbanRole;

  const [ordersByStatus, setOrdersByStatus] = useState<OrdersByStatus>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const columns = getOrderKanbanColumnsForRole(userRole);
  const visibleStatuses = columns.map((c) => c.status);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listOrders({
        pageSize: 300,
        sort: { fields: ['createdAt'], order: ['DESC'] },
      });
      const orders = response.data.filter(
        (o) => !ORDER_STATUS_EXCLUDED_FROM_KANBAN.includes(o.status)
      );
      const byStatus: OrdersByStatus = {};
      for (const status of visibleStatuses) {
        byStatus[status] = orders.filter((o) => o.status === status);
      }
      setOrdersByStatus(byStatus);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar pedidos');
      setOrdersByStatus({});
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, [visibleStatuses.join(',')]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      if (!visibleStatuses.includes(newStatus)) return;
      setUpdatingId(orderId);
      try {
        await updateOrder(orderId, { status: newStatus });
        setOrdersByStatus((prev) => {
          let order: Order | undefined;
          for (const status of visibleStatuses) {
            const list = prev[status] ?? [];
            order = list.find((o) => o.id === orderId);
            if (order) break;
          }
          if (!order) return prev;
          const next: OrdersByStatus = {};
          for (const status of visibleStatuses) {
            const list = prev[status] ?? [];
            if (status === newStatus) {
              next[status] = [
                { ...order, status: newStatus },
                ...list.filter((o) => o.id !== orderId),
              ];
            } else {
              next[status] = list.filter((o) => o.id !== orderId);
            }
          }
          return next;
        });
        toast.success('Status atualizado');
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        toast.error(e.response?.data?.message ?? 'Erro ao atualizar status');
      } finally {
        setUpdatingId(null);
      }
    },
    [visibleStatuses]
  );

  const moveToNextStatus = useCallback(
    (order: Order): OrderStatus | null => {
      const idx = visibleStatuses.indexOf(order.status);
      if (idx < 0 || idx >= visibleStatuses.length - 1) return null;
      return visibleStatuses[idx + 1];
    },
    [visibleStatuses]
  );

  return {
    columns,
    ordersByStatus,
    loading,
    error,
    setError,
    updateStatus,
    moveToNextStatus,
    loadOrders,
    updatingId,
    userRole,
  };
};
