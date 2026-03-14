/**
 * useOrderList Hook
 * Custom hook for order list page logic
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { listOrders, deleteOrder } from '@services/orders';
import type { Order, ListOrdersParams } from '@services/orders';
import type { OrderStatus, PaymentMethod, ConsumptionMode } from '@common/constants/orderEnums';

export const useOrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');
  const [selectedConsumption, setSelectedConsumption] = useState<string>('all');
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const filtersRef = useRef({
    selectedBranch,
    selectedStatus,
    selectedPayment,
    selectedConsumption,
  });
  useEffect(() => {
    filtersRef.current = {
      selectedBranch,
      selectedStatus,
      selectedPayment,
      selectedConsumption,
    };
  }, [selectedBranch, selectedStatus, selectedPayment, selectedConsumption]);

  const loadOrders = useCallback(async (overridePageIndex?: number) => {
    const { selectedBranch, selectedStatus, selectedPayment, selectedConsumption } = filtersRef.current;
    const pageIndex = overridePageIndex ?? pagination.pageIndex;
    try {
      setLoading(true);
      setError(null);

      const params: ListOrdersParams = {
        pageIndex,
        pageSize: pagination.pageSize,
        sort: { fields: ['createdAt'], order: ['DESC'] },
      };

      if (selectedStatus !== 'all') {
        params.status = selectedStatus as OrderStatus;
      }
      if (selectedPayment !== 'all') {
        params.paymentMethod = selectedPayment as PaymentMethod;
      }
      if (selectedConsumption !== 'all') {
        params.consumptionMode = selectedConsumption as ConsumptionMode;
      }
      if (selectedBranch !== 'all') {
        params.branchId = selectedBranch;
      }

      const response = await listOrders(params);

      setOrders(response.data);
      setPagination({
        total: response.total,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      console.error('Erro ao carregar pedidos:', err);
      setError(e.response?.data?.message ?? 'Erro ao carregar pedidos');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleDelete = async (id: string, orderLabel: string): Promise<void> => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o pedido "${orderLabel}"? Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;

    try {
      await deleteOrder(id);
      toast.success('Pedido excluído com sucesso!');
      await loadOrders();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number } };
      const msg = e.response?.data?.message ?? 'Erro ao excluir pedido';
      toast.error(msg);
      setError(msg);
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    loadOrders(0);
  };

  const handleClearSearch = () => {
    setSelectedBranch('all');
    setSelectedStatus('all');
    setSelectedPayment('all');
    setSelectedConsumption('all');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setTimeout(() => loadOrders(0), 0);
  };

  return {
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
    loadOrders,
  };
}
