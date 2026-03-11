/**
 * useCreateOrder Hook
 * Creates order then order items (and optionally order delivery)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { createOrder } from '@services/orders';
import { createOrderItem } from '@services/order-items';
import { CONSUMPTION_MODE } from '@common/constants/orderEnums';
import { orderFormSchema, type OrderFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCreateOrder = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

  const onSubmit = async (data: OrderFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const totalCentavos = Math.round(Number(data.total) * 100);

      const createPayload = {
        branchId: data.branchId,
        total: totalCentavos,
        consumptionMode: data.consumptionMode,
        clientId: data.clientId?.trim() || undefined,
        attendantId: data.attendantId?.trim() || undefined,
        status: data.status,
        paymentMethod: data.paymentMethod,
      };

      if (data.consumptionMode === CONSUMPTION_MODE.delivery && data.deliveryAddressId?.trim()) {
        (createPayload as Record<string, unknown>).deliveryAddressId = data.deliveryAddressId.trim();
      }

      const { id: orderId } = await createOrder(createPayload);

      for (const item of data.items ?? []) {
        const unitPriceCentavos = Math.round(Number(item.unitPrice) * 100);
        await createOrderItem({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: unitPriceCentavos,
          note: item.note?.trim() || undefined,
        });
      }

      toast.success('Pedido criado com sucesso!');
      navigate(ROUTES.ORDERS_DETAILS.replace(':id', orderId));
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao criar pedido';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.ORDERS);
  };

  return { form, isLoading, error, setError, onSubmit, handleCancel };
};
