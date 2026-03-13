/**
 * useDashboardRecentOrders
 * Busca os últimos pedidos para o dashboard
 */

import { useState, useEffect } from 'react';
import { listOrders } from '@services/orders';
import type { Order } from '@services/orders';

const PAGE_SIZE = 5;

export function useDashboardRecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listOrders({
          pageSize: PAGE_SIZE,
          sort: { fields: ['createdAt'], order: ['DESC'] },
        } as Record<string, unknown>);
        if (!cancelled) {
          setOrders(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Erro ao carregar pedidos recentes:', err);
          setError('Erro ao carregar pedidos');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { orders, loading, error };
}
