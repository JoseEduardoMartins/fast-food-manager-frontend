/**
 * Dashboard configuration
 * Mapeia permissões para widgets do dashboard
 * Cada widget só é exibido se o usuário tiver a permissão correspondente (ou role quando permissions vazias)
 */

import type { LucideIcon } from 'lucide-react';
import {
  Users,
  Building2,
  Store,
  Package,
  UtensilsCrossed,
  Leaf,
  Layers,
  ShoppingCart,
  ShieldCheck,
  Truck,
  DollarSign,
  UserPlus,
} from 'lucide-react';
import { ROUTES } from '@common/constants';
import { PERMISSIONS } from '@common/constants/permissions';
import type { UserRole } from '@services/auth';

export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Permissão necessária para exibir (quando permissions.length > 0) */
  permission: string;
  /** Roles que podem ver (fallback quando permissions vazias - ex: gerente não vê users/companies) */
  allowedRoles: UserRole[];
  /** Rota para navegação ao clicar */
  route?: string;
  /** Formato do valor: 'number' | 'currency' | 'raw' */
  format?: 'number' | 'currency' | 'raw';
}

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: 'users',
    title: 'Usuários',
    description: 'Usuários cadastrados no sistema',
    icon: Users,
    permission: PERMISSIONS.users.list,
    allowedRoles: ['admin'],
    route: ROUTES.USERS,
    format: 'number',
  },
  {
    id: 'roles',
    title: 'Perfis de Acesso',
    description: 'Perfis de acesso configurados',
    icon: ShieldCheck,
    permission: PERMISSIONS.roles.list,
    allowedRoles: ['admin', 'owner'],
    route: ROUTES.ROLES,
    format: 'number',
  },
  {
    id: 'companies',
    title: 'Empresas',
    description: 'Empresas cadastradas',
    icon: Building2,
    permission: PERMISSIONS.companies.list,
    allowedRoles: ['admin', 'owner'],
    route: ROUTES.COMPANIES,
    format: 'number',
  },
  {
    id: 'branches',
    title: 'Filiais',
    description: 'Filiais em operação',
    icon: Store,
    permission: PERMISSIONS.branches.list,
    allowedRoles: ['admin', 'owner'],
    route: ROUTES.BRANCHES,
    format: 'number',
  },
  {
    id: 'orders',
    title: 'Pedidos',
    description: 'Total de pedidos',
    icon: ShoppingCart,
    permission: PERMISSIONS.orders.list,
    allowedRoles: ['admin', 'owner', 'manager', 'attendant', 'delivery'],
    route: ROUTES.ORDERS,
    format: 'number',
  },
  {
    id: 'orders-today',
    title: 'Pedidos Hoje',
    description: 'Pedidos realizados hoje',
    icon: ShoppingCart,
    permission: PERMISSIONS.orders.list,
    allowedRoles: ['admin', 'owner', 'manager', 'attendant', 'delivery'],
    route: ROUTES.ORDERS,
    format: 'number',
  },
  {
    id: 'revenue-today',
    title: 'Faturamento Hoje',
    description: 'Total faturado hoje',
    icon: DollarSign,
    permission: PERMISSIONS.orders.list,
    allowedRoles: ['admin', 'owner', 'manager', 'attendant', 'delivery'],
    format: 'currency',
  },
  {
    id: 'products',
    title: 'Produtos',
    description: 'Produtos cadastrados',
    icon: Package,
    permission: PERMISSIONS.products.list,
    allowedRoles: ['admin', 'owner', 'manager', 'cook', 'attendant'],
    route: ROUTES.PRODUCTS,
    format: 'number',
  },
  {
    id: 'ingredients',
    title: 'Ingredientes',
    description: 'Ingredientes disponíveis',
    icon: Leaf,
    permission: PERMISSIONS.ingredients.list,
    allowedRoles: ['admin', 'owner', 'manager', 'cook'],
    route: ROUTES.INGREDIENTS,
    format: 'number',
  },
  {
    id: 'menus',
    title: 'Menus',
    description: 'Menus cadastrados',
    icon: UtensilsCrossed,
    permission: PERMISSIONS.menus.list,
    allowedRoles: ['admin', 'owner', 'manager', 'attendant'],
    route: ROUTES.MENUS,
    format: 'number',
  },
  {
    id: 'categories',
    title: 'Categorias',
    description: 'Categorias cadastradas',
    icon: Layers,
    permission: PERMISSIONS.categories.list,
    allowedRoles: ['admin', 'owner', 'manager', 'attendant'],
    route: ROUTES.CATEGORIES,
    format: 'number',
  },
  {
    id: 'deliveries',
    title: 'Entregas',
    description: 'Entregas realizadas',
    icon: Truck,
    permission: PERMISSIONS.orderDeliveries.list,
    allowedRoles: ['admin', 'owner', 'manager', 'attendant', 'delivery'],
    route: ROUTES.DELIVERIES,
    format: 'number',
  },
  {
    id: 'new-users-today',
    title: 'Novos Usuários Hoje',
    description: 'Usuários cadastrados hoje',
    icon: UserPlus,
    permission: PERMISSIONS.users.list,
    allowedRoles: ['admin'],
    format: 'number',
  },
];
