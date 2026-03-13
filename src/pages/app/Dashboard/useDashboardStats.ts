/**
 * useDashboardStats Hook
 * Busca estatísticas do dashboard conforme permissões do usuário
 */

import { useState, useEffect, useCallback } from 'react';
import { listUsers } from '@services/users';
import { listCompanies } from '@services/companies';
import { listBranches } from '@services/branches';
import { listOrders } from '@services/orders';
import { listProducts } from '@services/products';
import { listIngredients } from '@services/ingredients';
import { listMenus } from '@services/menus';
import { listCategories } from '@services/categories';
import { listRoles } from '@services/roles';
import { listOrderDeliveries } from '@services/order-deliveries';
import { formatCurrency } from '@common/helpers';


export interface DashboardStats {
  users?: number;
  roles?: number;
  companies?: number;
  branches?: number;
  orders?: number;
  ordersToday?: number;
  revenueToday?: number;
  products?: number;
  ingredients?: number;
  menus?: number;
  categories?: number;
  deliveries?: number;
  newUsersToday?: number;
}

export const useDashboardStats = (enabledWidgetIds: string[]) => {
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (enabledWidgetIds.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const results: DashboardStats = {};

    try {
      const promises: Promise<void>[] = [];

      if (enabledWidgetIds.includes('users')) {
        promises.push(
          listUsers({ pageSize: 1 }).then((r) => {
            results.users = r.total;
          })
        );
      }

      if (enabledWidgetIds.includes('new-users-today')) {
        promises.push(
          listUsers({ pageSize: 200, sort: { fields: ['createdAt'], order: ['DESC'] } } as Record<string, unknown>)
            .then((r) => {
              const todayStr = new Date().toISOString().slice(0, 10);
              results.newUsersToday = r.data.filter((u) =>
                u.createdAt?.startsWith(todayStr)
              ).length;
            })
            .catch(() => {
              results.newUsersToday = undefined;
            })
        );
      }

      if (enabledWidgetIds.includes('roles')) {
        promises.push(
          listRoles({ pageSize: 1 }).then((r) => {
            results.roles = r.total;
          })
        );
      }

      if (enabledWidgetIds.includes('companies')) {
        promises.push(
          listCompanies({ pageSize: 1 }).then((r) => {
            results.companies = r.total;
          })
        );
      }

      if (enabledWidgetIds.includes('branches')) {
        promises.push(
          listBranches({ pageSize: 1 }).then((r) => {
            results.branches = r.total;
          })
        );
      }

      if (enabledWidgetIds.includes('orders')) {
        promises.push(
          listOrders({ pageSize: 1 }).then((r) => {
            results.orders = r.total;
          })
        );
      }

      if (enabledWidgetIds.includes('orders-today') || enabledWidgetIds.includes('revenue-today')) {
        promises.push(
          listOrders({
            pageSize: 500,
            sort: { fields: ['createdAt'], order: ['DESC'] },
          } as Record<string, unknown>).then((r) => {
            const todayStr = new Date().toISOString().slice(0, 10);
            const todayOrders = r.data.filter((o) =>
              o.createdAt?.startsWith(todayStr)
            );
            if (enabledWidgetIds.includes('orders-today')) {
              results.ordersToday = todayOrders.length;
            }
            if (enabledWidgetIds.includes('revenue-today')) {
              results.revenueToday = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
            }
          })
        );
      }

      if (enabledWidgetIds.includes('products')) {
        promises.push(
          listProducts({ pageSize: 1 }).then((r) => {
            results.products = r.total;
          })
        );
      }

      if (enabledWidgetIds.includes('ingredients')) {
        promises.push(
          listIngredients({ pageSize: 1 }).then((r) => {
            results.ingredients = r.total;
          })
        );
      }

      if (enabledWidgetIds.includes('menus')) {
        promises.push(
          listMenus({ pageSize: 1 }).then((r) => {
            results.menus = r.total;
          })
        );
      }

      if (enabledWidgetIds.includes('categories')) {
        promises.push(
          listCategories({ pageSize: 1 }).then((r) => {
            results.categories = r.total;
          })
        );
      }

      if (enabledWidgetIds.includes('deliveries')) {
        promises.push(
          listOrderDeliveries({ pageSize: 1 }).then((r) => {
            results.deliveries = r.total;
          })
        );
      }

      await Promise.allSettled(promises);
      setStats(results);
    } catch (err) {
      console.error('Erro ao carregar estatísticas do dashboard:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  }, [enabledWidgetIds.join(',')]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const getWidgetValue = (widgetId: string, format?: 'number' | 'currency' | 'raw'): string | number => {
    const keyMap: Record<string, keyof DashboardStats> = {
      users: 'users',
      roles: 'roles',
      companies: 'companies',
      branches: 'branches',
      orders: 'orders',
      'orders-today': 'ordersToday',
      'revenue-today': 'revenueToday',
      products: 'products',
      ingredients: 'ingredients',
      menus: 'menus',
      categories: 'categories',
      deliveries: 'deliveries',
      'new-users-today': 'newUsersToday',
    };
    const key = keyMap[widgetId];
    const value = key ? stats[key] : undefined;
    if (value === undefined || value === null) return '—';

    if (format === 'currency' && typeof value === 'number') {
      return formatCurrency(value);
    }
    return value;
  };

  return { stats, loading, error, reload: fetchStats, getWidgetValue };
};
