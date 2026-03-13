/**
 * useDashboardRecentUsers
 * Busca os últimos usuários cadastrados para o dashboard
 */

import { useState, useEffect } from 'react';
import { listUsers } from '@services/users';
import type { User } from '@services/users';

const PAGE_SIZE = 5;

export function useDashboardRecentUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await listUsers({ pageSize: PAGE_SIZE });
        if (!cancelled) {
          // Ordenar por createdAt desc (mais recentes primeiro)
          const sorted = [...res.data].sort((a, b) => {
            const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return db - da;
          });
          setUsers(sorted.slice(0, PAGE_SIZE));
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Erro ao carregar usuários recentes:', err);
          setError('Erro ao carregar usuários');
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

  return { users, loading, error };
}
