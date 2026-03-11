import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Users,
  Building2,
  Store,
  UtensilsCrossed,
  Layers,
  Package,
  Leaf,
  PackageOpen,
} from 'lucide-react';
import { cn } from '@common/helpers';
import { Icon } from '../../atoms';
import { ROUTES } from '@common/constants';
import type { SidebarItemConfig, SidebarGroupItem, SidebarLinkItem, SidebarProps } from './Sidebar.type';

const SIDEBAR_ITEMS: SidebarItemConfig[] = [
  {
    type: 'link',
    path: ROUTES.DASHBOARD,
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'owner', 'manager', 'cook', 'attendant', 'delivery'],
  },
  {
    type: 'link',
    path: ROUTES.ORDERS,
    label: 'Pedidos',
    icon: ShoppingCart,
    roles: ['admin', 'owner', 'manager', 'attendant', 'delivery'],
  },
  {
    type: 'group',
    label: 'Cadastros',
    icon: FolderOpen,
    children: [
      { path: ROUTES.USERS, label: 'Usuários', icon: Users, roles: ['admin'] },
      { path: ROUTES.COMPANIES, label: 'Empresas', icon: Building2, roles: ['admin', 'owner'] },
      { path: ROUTES.BRANCHES, label: 'Filiais', icon: Store, roles: ['admin', 'owner'] },
      { path: ROUTES.MENUS, label: 'Menus', icon: UtensilsCrossed, roles: ['admin', 'owner', 'manager', 'attendant'] },
      { path: ROUTES.CATEGORIES, label: 'Categorias', icon: Layers, roles: ['admin', 'owner', 'manager', 'attendant'] },
      { path: ROUTES.PRODUCTS, label: 'Produtos', icon: Package, roles: ['admin', 'owner', 'manager', 'cook', 'attendant'] },
      { path: ROUTES.INGREDIENTS, label: 'Ingredientes', icon: Leaf, roles: ['admin', 'owner', 'manager', 'cook'] },
      { path: ROUTES.STOCK, label: 'Estoque', icon: PackageOpen, roles: ['admin', 'owner', 'manager', 'cook'] },
    ],
  },
];

function isGroup(item: SidebarItemConfig): item is SidebarGroupItem {
  return item.type === 'group';
}

function isLink(item: SidebarItemConfig): item is SidebarLinkItem {
  return item.type === 'link';
}

const linkBaseClass =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
const linkActiveClass = 'bg-primary text-primary-foreground';
const linkInactiveClass = 'text-muted-foreground hover:bg-muted hover:text-foreground';

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, userRole, ...props }, ref) => {
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Cadastros: true });

    const toggleGroup = (label: string) => {
      setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const visibleItems = SIDEBAR_ITEMS.filter((item) => {
      if (isLink(item)) return item.roles.includes(userRole);
      if (isGroup(item)) {
        const visibleChildren = item.children.filter((c) => c.roles.includes(userRole));
        return visibleChildren.length > 0;
      }
      return false;
    });

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
          {visibleItems.map((item) => {
            if (isLink(item)) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      linkBaseClass,
                      isActive ? linkActiveClass : linkInactiveClass
                    )
                  }
                  end={item.path === ROUTES.DASHBOARD}
                >
                  <Icon icon={item.icon} size={18} />
                  {item.label}
                </NavLink>
              );
            }

            if (isGroup(item)) {
              const visibleChildren = item.children.filter((c) =>
                c.roles.includes(userRole)
              );
              if (visibleChildren.length === 0) return null;

              const isOpen = openGroups[item.label] ?? true;
              const GroupIcon = item.icon;

              return (
                <div key={item.label} className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    className={cn(
                      linkBaseClass,
                      'w-full justify-between',
                      linkInactiveClass
                    )}
                  >
                    <span className="flex items-center gap-3">
                      {GroupIcon && <Icon icon={GroupIcon} size={18} />}
                      {item.label}
                    </span>
                    <Icon
                      icon={isOpen ? ChevronDown : ChevronRight}
                      size={16}
                      className="shrink-0"
                    />
                  </button>
                  {isOpen && (
                    <div className="ml-4 flex flex-col gap-0.5 border-l border-border pl-2">
                      {visibleChildren.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            cn(
                              linkBaseClass,
                              'py-1.5 text-xs',
                              isActive
                                ? linkActiveClass
                                : linkInactiveClass
                            )
                          }
                          end={child.path === ROUTES.DASHBOARD}
                        >
                          <Icon icon={child.icon} size={16} />
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </nav>
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
