import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  UserCircle,
  ShoppingCart,
  PackageOpen,
  FolderOpen,
  Users,
  ShieldCheck,
  Building2,
  Store,
  UtensilsCrossed,
  Layers,
  Package,
  Leaf,
} from 'lucide-react';

import { ROUTES } from './routes';
import { PERMISSIONS } from './permissions';

export type NavigationCatalogLink = {
  type: 'link';
  id: string;
  label: string;
  path: string;
  /** permission required to show when permissions are available */
  permission?: string;
  icon: LucideIcon;
};

export type NavigationCatalogGroup = {
  type: 'group';
  id: string;
  label: string;
  icon?: LucideIcon;
  children: NavigationCatalogLink[];
};

export type NavigationCatalogItem = NavigationCatalogLink | NavigationCatalogGroup;

/**
 * Navigation catalog (menus/submenus) for the app.
 * Backend can return a filtered version of this by RBAC.
 */
export const NAVIGATION_CATALOG: NavigationCatalogItem[] = [
  {
    type: 'link',
    id: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    type: 'link',
    id: 'profile',
    label: 'Meu Perfil',
    path: ROUTES.PROFILE,
    icon: UserCircle,
  },
  {
    type: 'link',
    id: 'orders',
    label: 'Pedidos',
    path: ROUTES.ORDERS,
    permission: PERMISSIONS.orders.list,
    icon: ShoppingCart,
  },
  {
    type: 'link',
    id: 'stock',
    label: 'Estoque',
    path: ROUTES.STOCK,
    permission: PERMISSIONS.products.list,
    icon: PackageOpen,
  },
  {
    type: 'group',
    id: 'registrations',
    label: 'Cadastros',
    icon: FolderOpen,
    children: [
      {
        type: 'link',
        id: 'users',
        label: 'Usuários',
        path: ROUTES.USERS,
        permission: PERMISSIONS.users.list,
        icon: Users,
      },
      {
        type: 'link',
        id: 'roles',
        label: 'Perfis de Acesso',
        path: ROUTES.ROLES,
        permission: PERMISSIONS.roles.list,
        icon: ShieldCheck,
      },
      {
        type: 'link',
        id: 'companies',
        label: 'Empresas',
        path: ROUTES.COMPANIES,
        permission: PERMISSIONS.companies.list,
        icon: Building2,
      },
      {
        type: 'link',
        id: 'branches',
        label: 'Filiais',
        path: ROUTES.BRANCHES,
        permission: PERMISSIONS.branches.list,
        icon: Store,
      },
      {
        type: 'link',
        id: 'menus',
        label: 'Menus',
        path: ROUTES.MENUS,
        permission: PERMISSIONS.menus.list,
        icon: UtensilsCrossed,
      },
      {
        type: 'link',
        id: 'categories',
        label: 'Categorias',
        path: ROUTES.CATEGORIES,
        permission: PERMISSIONS.categories.list,
        icon: Layers,
      },
      {
        type: 'link',
        id: 'products',
        label: 'Produtos',
        path: ROUTES.PRODUCTS,
        permission: PERMISSIONS.products.list,
        icon: Package,
      },
      {
        type: 'link',
        id: 'ingredients',
        label: 'Ingredientes',
        path: ROUTES.INGREDIENTS,
        permission: PERMISSIONS.ingredients.list,
        icon: Leaf,
      },
    ],
  },
];

