/**
 * useOrderDetails Hook
 * Load order, items, delivery; delete / navigate
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getOrderById, deleteOrder } from '@services/orders';
import { listOrderItems } from '@services/order-items';
import { listOrderDeliveries } from '@services/order-deliveries';
import type { Order } from '@services/orders';
import type { OrderItem } from '@services/order-items';
import type { OrderDelivery } from '@services/order-deliveries';
import { ROUTES } from '@common/constants';

export const useOrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [delivery, setDelivery] = useState<OrderDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [orderData, itemsRes, deliveriesRes] = await Promise.all([
        getOrderById(id),
        listOrderItems({ orderId: id, pageSize: 100 }),
        listOrderDeliveries({ orderId: id, pageSize: 1 }),
      ]);
      setOrder(orderData);
      setItems(itemsRes.data);
      setDelivery(deliveriesRes.data[0] ?? null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar pedido');
      toast.error('Erro ao carregar pedido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.ORDERS);
      return;
    }
    loadOrder();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !order) return;
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.'
    );
    if (!confirmed) return;
    try {
      await deleteOrder(id);
      toast.success('Pedido excluído com sucesso!');
      navigate(ROUTES.ORDERS);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir pedido';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleEdit = () => {
    if (id) navigate(ROUTES.ORDERS_EDIT.replace(':id', id));
  };

  const handleBack = () => {
    navigate(ROUTES.ORDERS);
  };

  return {
    order,
    items,
    delivery,
    loading,
    error,
    setError,
    loadOrder,
    handleDelete,
    handleEdit,
    handleBack,
  };
};
