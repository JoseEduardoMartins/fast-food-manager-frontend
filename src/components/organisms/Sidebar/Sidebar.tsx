import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Users,
  UserCircle,
  Building2,
  Store,
  UtensilsCrossed,
  Layers,
  Package,
  Leaf,
  PackageOpen,
  ShieldCheck,
  Truck,
  MapPin,
} from 'lucide-react';
import { cn } from '@common/helpers';
import { Icon } from '../../atoms';
import { ROUTES } from '@common/constants';
import { PERMISSIONS } from '@common/constants/permissions';
import type { SidebarItemConfig, SidebarGroupItem, SidebarLinkItem, SidebarProps } from './Sidebar.type';
import { NAVIGATION_CATALOG } from '@common/constants/navigationCatalog';
import type { NavigationItem } from '@services/navigation';

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
    path: ROUTES.PROFILE,
    label: 'Meu Perfil',
    icon: UserCircle,
    roles: ['admin', 'owner', 'manager', 'cook', 'attendant', 'customer', 'delivery'],
  },
  {
    type: 'link',
    path: ROUTES.ORDERS,
    label: 'Pedidos',
    icon: ShoppingCart,
    permission: PERMISSIONS.orders.list,
    roles: ['admin', 'owner', 'manager', 'attendant', 'delivery'],
  },
  {
    type: 'link',
    path: ROUTES.STOCK,
    label: 'Estoque',
    icon: PackageOpen,
    permission: PERMISSIONS.products.list,
    roles: ['admin', 'owner', 'manager', 'cook'],
  },
  {
    type: 'group',
    label: 'Cadastros',
    icon: FolderOpen,
    children: [
      { path: ROUTES.USERS, label: 'Usuários', icon: Users, permission: PERMISSIONS.users.list, roles: ['admin'] },
      { path: ROUTES.ROLES, label: 'Perfis de Acesso', icon: ShieldCheck, permission: PERMISSIONS.roles.list, roles: ['admin', 'owner'] },
      { path: ROUTES.COMPANIES, label: 'Empresas', icon: Building2, permission: PERMISSIONS.companies.list, roles: ['admin', 'owner'] },
      { path: ROUTES.BRANCHES, label: 'Filiais', icon: Store, permission: PERMISSIONS.branches.list, roles: ['admin', 'owner'] },
      { path: ROUTES.MENUS, label: 'Menus', icon: UtensilsCrossed, permission: PERMISSIONS.menus.list, roles: ['admin', 'owner', 'manager', 'attendant'] },
      { path: ROUTES.CATEGORIES, label: 'Categorias', icon: Layers, permission: PERMISSIONS.categories.list, roles: ['admin', 'owner', 'manager', 'attendant'] },
      { path: ROUTES.PRODUCTS, label: 'Produtos', icon: Package, permission: PERMISSIONS.products.list, roles: ['admin', 'owner', 'manager', 'cook', 'attendant'] },
      { path: ROUTES.INGREDIENTS, label: 'Ingredientes', icon: Leaf, permission: PERMISSIONS.ingredients.list, roles: ['admin', 'owner', 'manager', 'cook'] },
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
  ({ className, userRole, permissions = [], hasPermission = () => false, navigation = [], ...props }, ref) => {
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Cadastros: true });

    const usePermissions = permissions.length > 0;

    const toggleGroup = (label: string) => {
      setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const canShowByPermission = (permission?: string) => {
      if (!usePermissions) return true;
      if (!permission) return true;
      return hasPermission(permission);
    };

    const iconByKey = (key?: string) => {
      switch (key) {
        case 'dashboard':
          return LayoutDashboard;
        case 'profile':
          return UserCircle;
        case 'orders':
          return ShoppingCart;
        case 'stock':
          return PackageOpen;
        case 'deliveries':
          return Truck;
        case 'my-deliveries':
          return MapPin;
        case 'registrations':
          return FolderOpen;
        case 'users':
          return Users;
        case 'roles':
          return ShieldCheck;
        case 'companies':
          return Building2;
        case 'branches':
          return Store;
        case 'menus':
          return UtensilsCrossed;
        case 'categories':
          return Layers;
        case 'products':
          return Package;
        case 'ingredients':
          return Leaf;
        default:
          return null;
      }
    };

    const sourceIsBackend = Array.isArray(navigation) && navigation.length > 0;

    const visibleCatalogItems = (SIDEBAR_ITEMS.length ? SIDEBAR_ITEMS : (NAVIGATION_CATALOG as unknown as SidebarItemConfig[])).filter((item: SidebarItemConfig) => {
      const canShowLink = (i: SidebarLinkItem | Omit<SidebarLinkItem, 'type'>) => {
        if (usePermissions && i.permission) return hasPermission(i.permission);
        return i.roles.includes(userRole);
      };
      if (isLink(item)) return canShowLink(item);
      if (isGroup(item)) {
        const visibleChildren = item.children.filter((c) => canShowLink(c));
        return visibleChildren.length > 0;
      }
      return false;
    });

    const visibleBackendItems = (navigation as unknown as NavigationItem[])
      .map((item) => item)
      .filter((item) => {
        if (item.type === 'link') return canShowByPermission(item.permission);
        if (item.type === 'group') {
          const children = (item.children ?? []).filter((c: any) =>
            c?.type === 'link' ? canShowByPermission(c.permission) : true
          );
          return children.length > 0;
        }
        return false;
      });

    const visibleItems = sourceIsBackend ? visibleBackendItems : visibleCatalogItems;

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
          {sourceIsBackend
            ? (visibleItems as unknown as NavigationItem[]).map((item) => {
                if (item.type === 'link') {
                  const Lucide = iconByKey(item.icon ?? item.id);
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          linkBaseClass,
                          isActive ? linkActiveClass : linkInactiveClass
                        )
                      }
                      end={item.path === ROUTES.DASHBOARD}
                    >
                      {Lucide && <Icon icon={Lucide} size={18} />}
                      {item.label}
                    </NavLink>
                  );
                }

                if (item.type === 'group') {
                  const visibleChildren = (item.children ?? []).filter((c: any) =>
                    c?.type === 'link' ? canShowByPermission(c.permission) : true
                  ) as any[];
                  if (visibleChildren.length === 0) return null;
                  const isOpen = openGroups[item.label] ?? true;
                  const GroupIcon = iconByKey(item.icon ?? item.id);
                  return (
                    <div key={item.id} className="flex flex-col gap-1">
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
                          {visibleChildren.map((child) => {
                            const childIcon = iconByKey(child.icon ?? child.id);
                            return (
                              <NavLink
                                key={child.id}
                                to={child.path}
                                className={({ isActive }) =>
                                  cn(
                                    linkBaseClass,
                                    'py-1.5 text-xs',
                                    isActive ? linkActiveClass : linkInactiveClass
                                  )
                                }
                                end={child.path === ROUTES.DASHBOARD}
                              >
                                {childIcon && <Icon icon={childIcon} size={16} />}
                                {child.label}
                              </NavLink>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return null;
              })
            : (visibleItems as SidebarItemConfig[]).map((item) => {
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
              const canShowLink = (i: SidebarLinkItem | Omit<SidebarLinkItem, 'type'>) => {
                if (usePermissions && i.permission) return hasPermission(i.permission);
                return i.roles.includes(userRole);
              };
              const visibleChildren = item.children.filter((c) => canShowLink(c));
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
