import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Store,
  ShoppingCart,
  UtensilsCrossed,
  Package,
  Leaf,
  PackageOpen,
} from 'lucide-react';
import { cn } from '@common/helpers';
import { Icon } from '../../atoms';
import { ROUTES } from '@common/constants';
import type { SidebarItemConfig, SidebarProps } from './Sidebar.type';

const SIDEBAR_ITEMS: SidebarItemConfig[] = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'owner', 'manager', 'cook', 'attendant', 'delivery'] },
  { path: ROUTES.USERS, label: 'Usuários', icon: Users, roles: ['admin'] },
  { path: ROUTES.COMPANIES, label: 'Empresas', icon: Building2, roles: ['admin', 'owner'] },
  { path: ROUTES.BRANCHES, label: 'Filiais', icon: Store, roles: ['admin', 'owner'] },
  { path: ROUTES.ORDERS, label: 'Pedidos', icon: ShoppingCart, roles: ['admin', 'owner', 'manager', 'attendant', 'delivery'] },
  { path: ROUTES.MENUS, label: 'Menus', icon: UtensilsCrossed, roles: ['admin', 'owner', 'manager', 'attendant'] },
  { path: ROUTES.PRODUCTS, label: 'Produtos', icon: Package, roles: ['admin', 'owner', 'manager', 'cook', 'attendant'] },
  { path: ROUTES.INGREDIENTS, label: 'Ingredientes', icon: Leaf, roles: ['admin', 'owner', 'manager', 'cook'] },
  { path: ROUTES.STOCK, label: 'Estoque', icon: PackageOpen, roles: ['admin', 'owner', 'manager', 'cook'] },
];

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, userRole, ...props }, ref) => {
    const visibleItems = SIDEBAR_ITEMS.filter((item) => item.roles.includes(userRole));

    if (visibleItems.length === 0) {
      return null;
    }

    return (
      <aside
        ref={ref}
        className={cn(
          'flex w-56 shrink-0 flex-col border-r border-border bg-muted/30',
          className
        )}
        {...props}
      >
        <nav className="flex flex-col gap-1 p-4">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
              end={item.path === ROUTES.DASHBOARD}
            >
              <Icon icon={item.icon} size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
