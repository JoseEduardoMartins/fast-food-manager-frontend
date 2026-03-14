/**
 * useDeliveryList Hook
 * Lista pedidos delivery prontos para atribuir entregador
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { listOrders } from '@services/orders';
import { createOrderDelivery } from '@services/order-deliveries';
import { listUsers } from '@services/users';
import { useBranches } from '@common/hooks';
import type { Order } from '@services/orders';
import type { User } from '@services/users';
import type { OrderStatus } from '@common/constants/orderEnums';

export const useDeliveryList = () => {
  const { branches } = useBranches({ pageSize: 500 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryUsers, setDeliveryUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  const filtersRef = useRef({ selectedStatus, selectedBranchId });
  useEffect(() => {
    filtersRef.current = { selectedStatus, selectedBranchId };
  }, [selectedStatus, selectedBranchId]);

  const loadOrders = useCallback(async () => {
    const { selectedStatus, selectedBranchId } = filtersRef.current;
    try {
      setLoading(true);
      setError(null);

      const params: Parameters<typeof listOrders>[0] = {
        consumptionMode: 'delivery',
        pageSize: 100,
        selectFields: ['id', 'status', 'total', 'client', 'deliveryAddress', 'orderDelivery', 'createdAt', 'branchId'],
      };

      if (selectedStatus !== 'all') {
        params.status = selectedStatus as OrderStatus;
      }
      if (selectedBranchId !== 'all') {
        params.branchId = selectedBranchId;
      }

      const response = await listOrders(params);

      // Filtrar apenas pedidos que não foram entregues ou cancelados
      const activeOrders = response.data.filter(
        (o) => o.status !== 'delivered' && o.status !== 'cancelled'
      );

      setOrders(activeOrders);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao carregar pedidos';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDeliveryUsers = useCallback(async () => {
    try {
      // Buscar usuários com perfil de entregador
      const response = await listUsers({
        pageSize: 100,
        isActive: true,
        selectFields: ['id', 'name', 'email'],
      });

      // Filtrar usuários com role.code === 'delivery'
      const deliveryOnly = response.data.filter((u) => {
        if (typeof u.role === 'object' && u.role !== null) {
          return u.role.code === 'delivery';
        }
        return u.role === 'delivery';
      });

      setDeliveryUsers(deliveryOnly);
    } catch (err) {
      console.error('Erro ao carregar entregadores:', err);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadDeliveryUsers();
  }, [loadOrders, loadDeliveryUsers]);

  const assignDelivery = async (orderId: string, userId: string) => {
    try {
      setAssigning(orderId);

      // Criar registro de entrega
      await createOrderDelivery({
        orderId,
        userId,
        status: 'assigned',
      });

      toast.success('Entregador atribuído com sucesso!');
      await loadOrders();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const msg = e.response?.data?.message ?? 'Erro ao atribuir entregador';
      toast.error(msg);
    } finally {
      setAssigning(null);
    }
  };

  const handleFilter = () => {
    loadOrders();
  };

  const handleClear = () => {
    setSelectedStatus('all');
    setSelectedBranchId('all');
    setTimeout(() => loadOrders(), 0);
  };

  return {
    orders,
    deliveryUsers,
    branches,
    loading,
    error,
    setError,
    assigning,
    assignDelivery,
    selectedStatus,
    setSelectedStatus,
    selectedBranchId,
    setSelectedBranchId,
    handleFilter,
    handleClear,
    reload: loadOrders,
  };
};
