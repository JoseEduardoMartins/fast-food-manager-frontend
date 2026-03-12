/**
 * useMyDeliveries Hook
 * Lista e gerencia entregas do entregador logado
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { listOrderDeliveries, updateOrderDelivery } from '@services/order-deliveries';
import { updateOrder } from '@services/orders';
import type { OrderDelivery } from '@services/order-deliveries';
import type { OrderDeliveryStatus } from '@common/constants/orderEnums';

export const useMyDeliveries = (userId: string | undefined) => {
  const [deliveries, setDeliveries] = useState<OrderDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadDeliveries = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await listOrderDeliveries({
        userId,
        pageSize: 100,
        selectFields: ['id', 'status', 'assignedAt', 'deliveredAt', 'note', 'order'],
      });

      // Filtrar apenas entregas ativas (não entregues ou falhadas)
      const active = response.data.filter(
        (d) => d.status === 'assigned' || d.status === 'in_transit'
      );

      setDeliveries(active);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao carregar entregas';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const updateStatus = async (
    deliveryId: string,
    status: OrderDeliveryStatus,
    note?: string
  ) => {
    try {
      setUpdating(deliveryId);

      // Atualizar status da entrega
      await updateOrderDelivery(deliveryId, { status, note });

      // Se entrega foi concluída, atualizar pedido também
      if (status === 'delivered') {
        const delivery = deliveries.find((d) => d.id === deliveryId);
        if (delivery?.orderId) {
          await updateOrder(delivery.orderId, { status: 'delivered' });
        }
      }

      toast.success('Status atualizado com sucesso!');
      await loadDeliveries();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao atualizar status';
      toast.error(msg);
    } finally {
      setUpdating(null);
    }
  };

  const startDelivery = (deliveryId: string) => {
    updateStatus(deliveryId, 'in_transit');
  };

  const completeDelivery = (deliveryId: string, note?: string) => {
    updateStatus(deliveryId, 'delivered', note);
  };

  const failDelivery = (deliveryId: string, note: string) => {
    updateStatus(deliveryId, 'failed', note);
  };

  return {
    deliveries,
    loading,
    error,
    setError,
    updating,
    startDelivery,
    completeDelivery,
    failDelivery,
    reload: loadDeliveries,
  };
};
