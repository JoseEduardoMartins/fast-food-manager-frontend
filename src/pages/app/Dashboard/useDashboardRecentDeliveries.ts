/**
 * useDashboardRecentDeliveries
 * Busca as últimas entregas para o dashboard
 */

import { useState, useEffect } from 'react';
import { listOrderDeliveries } from '@services/order-deliveries';
import type { OrderDelivery } from '@services/order-deliveries';

const PAGE_SIZE = 5;

export function useDashboardRecentDeliveries() {
  const [deliveries, setDeliveries] = useState<OrderDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listOrderDeliveries({
          pageSize: PAGE_SIZE,
          sortBy: 'createdAt',
          sortOrder: 'DESC',
        });
        if (!cancelled) {
          setDeliveries(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Erro ao carregar entregas recentes:', err);
          setError('Erro ao carregar entregas');
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

  return { deliveries, loading, error };
}
