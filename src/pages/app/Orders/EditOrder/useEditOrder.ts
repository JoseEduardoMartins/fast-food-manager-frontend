/**
 * useEditOrder Hook
 * Load order and items; update order and replace items on submit
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { getOrderById, updateOrder } from '@services/orders';
import { listOrderItems, createOrderItem, deleteOrderItem } from '@services/order-items';
import type { Order } from '@services/orders';
import type { OrderItemFormData } from '../schemas';
import { orderFormSchema, type OrderFormData } from '../schemas';
import { ROUTES } from '@common/constants';
import { CONSUMPTION_MODE } from '@common/constants/orderEnums';

export const useEditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema) as Resolver<OrderFormData>,
    defaultValues: {
      branchId: '',
      consumptionMode: CONSUMPTION_MODE.local,
      deliveryAddressId: '',
      clientId: '',
      attendantId: '',
      status: 'received',
      paymentMethod: undefined,
      total: 0,
      items: [],
    },
  });

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.ORDERS);
      return;
    }
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [orderData, itemsRes] = await Promise.all([
        getOrderById(id),
        listOrderItems({ orderId: id, pageSize: 100 }),
      ]);
      setOrder(orderData);

      const items: OrderItemFormData[] = itemsRes.data.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice / 100,
        note: item.note ?? '',
      }));

      form.reset({
        branchId: orderData.branchId,
        consumptionMode: orderData.consumptionMode,
        deliveryAddressId: orderData.deliveryAddressId ?? '',
        clientId: orderData.clientId ?? '',
        attendantId: orderData.attendantId ?? '',
        status: orderData.status,
        paymentMethod: orderData.paymentMethod ?? undefined,
        total: orderData.total / 100,
        items,
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message ?? 'Erro ao carregar pedido');
      toast.error('Erro ao carregar pedido');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    if (!id) return;
    setSaving(true);
    setError(null);

    try {
      const totalCentavos = Math.round(Number(data.total) * 100);
      await updateOrder(id, {
        status: data.status,
        paymentMethod: data.paymentMethod ?? undefined,
        consumptionMode: data.consumptionMode,
        deliveryAddressId: data.deliveryAddressId?.trim() || undefined,
        total: totalCentavos,
        clientId: data.clientId?.trim() || undefined,
        attendantId: data.attendantId?.trim() || undefined,
      });

      const existingItems = await listOrderItems({ orderId: id, pageSize: 500 });
      for (const item of existingItems.data) {
        await deleteOrderItem(item.id);
      }

      for (const item of data.items ?? []) {
        const unitPriceCentavos = Math.round(Number(item.unitPrice) * 100);
        await createOrderItem({
          orderId: id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: unitPriceCentavos,
          note: item.note?.trim() || undefined,
        });
      }

      toast.success('Pedido atualizado com sucesso!');
      navigate(ROUTES.ORDERS_DETAILS.replace(':id', id));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao atualizar pedido';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (id) navigate(ROUTES.ORDERS_DETAILS.replace(':id', id));
    else navigate(ROUTES.ORDERS);
  };

  return {
    order,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
    loadOrder,
  };
};
