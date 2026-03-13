/**
 * Dashboard
 * Exibe estatísticas e ações rápidas conforme permissões do usuário (RBAC)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  ShoppingCart,
  Package,
  Truck,
  RefreshCw,
} from 'lucide-react';
import { AppLayout, Title, Label, Button, Card, PageHeader, StatCard, Icon } from '@components';
import { useAuth } from '@contexts';
import { ROUTES } from '@common/constants';
import { PERMISSIONS } from '@common/constants/permissions';
import { DASHBOARD_WIDGETS } from './dashboardConfig';
import { useDashboardStats } from './useDashboardStats';
import { DashboardRecentOrders } from './DashboardRecentOrders';
import { DashboardRecentUsers } from './DashboardRecentUsers';
import { DashboardRecentDeliveries } from './DashboardRecentDeliveries';

/** Mapeia nomes de role (pt-BR) para códigos internos */
const ROLE_NAME_TO_CODE: Record<string, string> = {
  gerente: 'manager',
  administrador: 'admin',
  proprietário: 'owner',
  proprietario: 'owner',
  cozinheiro: 'cook',
  atendente: 'attendant',
  cliente: 'customer',
  entregador: 'delivery',
};

/** Obtém o role do usuário como string (user.role pode ser string ou objeto Role com code/name) */
function getUserRole(user: { role?: unknown } | null): string | undefined {
  if (!user?.role) return undefined;
  const r = user.role;
  let raw: string;
  if (typeof r === 'string') {
    raw = r;
  } else {
    const obj = r as { code?: string; name?: string };
    raw = obj?.code ?? obj?.name ?? '';
  }
  const normalized = raw?.toLowerCase().trim();
  return ROLE_NAME_TO_CODE[normalized] ?? (normalized || undefined);
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const userRole = getUserRole(user);

  /** Dashboard usa SEMPRE role como fonte de verdade - evita exibir dados quando backend retorna permissões incorretas */
  const canShowWidget = (widget: (typeof DASHBOARD_WIDGETS)[0]) =>
    !!userRole && widget.allowedRoles.includes(userRole as (typeof widget.allowedRoles)[number]);

  const canShowByRole = (allowedRoles: readonly string[]) =>
    !!userRole && allowedRoles.includes(userRole);

  const enabledWidgets = DASHBOARD_WIDGETS.filter(canShowWidget);
  const enabledWidgetIds = enabledWidgets.map((w) => w.id);

  const { loading, error, getWidgetValue, reload } = useDashboardStats(enabledWidgetIds);

  const quickActions = [
    {
      title: 'Gerenciamento de Usuários',
      description: 'Gerencie proprietários, gerentes, cozinheiros, atendentes e clientes',
      route: ROUTES.USERS,
      permission: PERMISSIONS.users.list,
      allowedRoles: ['admin'] as const,
      icon: Users,
    },
    {
      title: 'Gerenciamento de Empresas',
      description: 'Gerencie empresas, filiais e suas configurações',
      route: ROUTES.COMPANIES,
      permission: PERMISSIONS.companies.list,
      allowedRoles: ['admin', 'owner'] as const,
      icon: Building2,
    },
    {
      title: 'Gerenciamento de Pedidos',
      description: 'Visualize e gerencie todos os pedidos do sistema',
      route: ROUTES.ORDERS,
      permission: PERMISSIONS.orders.list,
      allowedRoles: ['admin', 'owner', 'manager', 'attendant', 'delivery'] as const,
      icon: ShoppingCart,
    },
    {
      title: 'Gerenciamento de Estoque',
      description: 'Controle produtos, ingredientes e níveis de estoque',
      route: ROUTES.STOCK,
      permission: PERMISSIONS.products.list,
      allowedRoles: ['admin', 'owner', 'manager', 'cook'] as const,
      icon: Package,
    },
    {
      title: 'Gerenciar Entregas',
      description: 'Atribua entregadores e acompanhe entregas',
      route: ROUTES.DELIVERIES,
      permission: PERMISSIONS.orderDeliveries.list,
      allowedRoles: ['admin', 'owner', 'manager', 'attendant', 'delivery'] as const,
      icon: Truck,
    },
  ];

  const visibleQuickActions = quickActions.filter((a) => canShowByRole(a.allowedRoles));

  return (
    <AppLayout user={user} onSignOut={signOut}>
      <div className="container py-8">
        <PageHeader
          title="Dashboard"
          description="Visão geral dos dados conforme suas permissões de acesso"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => reload()}
              disabled={loading}
              title="Atualizar dados"
            >
              <Icon icon={RefreshCw} size={16} className={loading ? 'animate-spin' : ''} />
            </Button>
          }
        />

        {error && (
          <Card className="p-4 mb-6 border-error bg-error/5">
            <Label className="text-error">{error}</Label>
          </Card>
        )}

        {/* Estatísticas - baseadas em permissões */}
        {enabledWidgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {enabledWidgets.map((widget) => {
              const value = loading ? '...' : getWidgetValue(widget.id, widget.format);
              const hasRoute = widget.route;

              return (
                <StatCard
                  key={widget.id}
                  title={widget.title}
                  value={value}
                  description={widget.description}
                  icon={widget.icon}
                  onClick={hasRoute ? () => navigate(widget.route!) : undefined}
                />
              );
            })}
          </div>
        ) : (
          <Card className="p-8 mb-8 text-center">
            <Label className="text-gray-500">
              Nenhum dado disponível para exibir. Entre em contato com o administrador para obter
              permissões de acesso.
            </Label>
          </Card>
        )}

        {/* Seções detalhadas - dados recentes (filtrado por role) */}
        {(canShowByRole(['admin', 'owner', 'manager', 'attendant', 'delivery']) ||
          canShowByRole(['admin']) ||
          canShowByRole(['admin', 'owner', 'manager', 'attendant', 'delivery'])) && (
          <div className="mb-8">
            <Title variant="h3" className="mb-4 font-semibold">
              Dados Recentes
            </Title>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {canShowByRole(['admin', 'owner', 'manager', 'attendant', 'delivery']) && (
                <DashboardRecentOrders />
              )}
              {canShowByRole(['admin']) && (
                <DashboardRecentUsers />
              )}
              {canShowByRole(['admin', 'owner', 'manager', 'attendant', 'delivery']) && (
                <DashboardRecentDeliveries />
              )}
            </div>
          </div>
        )}

        {/* Ações Rápidas - baseadas em permissões */}
        {visibleQuickActions.length > 0 && (
          <div className="mb-8">
            <Title variant="h3" className="mb-4 font-semibold">
              Ações Rápidas
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleQuickActions.map((action) => (
                <Card key={action.route} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-primary">
                      <Icon icon={action.icon} size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Title variant="h3" className="mb-2 font-semibold">
                        {action.title}
                      </Title>
                      <Label as="p" className="mb-4 text-gray-600 dark:text-gray-400 text-sm">
                        {action.description}
                      </Label>
                      <Button
                        onClick={() => navigate(action.route)}
                        className="w-full"
                        size="sm"
                      >
                        Acessar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
