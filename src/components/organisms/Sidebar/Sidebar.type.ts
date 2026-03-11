import type { HTMLAttributes } from 'react';
import type { UserRole } from '@services/auth';
import type { LucideIcon } from 'lucide-react';

/**
 * Sidebar menu link item
 */
export interface SidebarLinkItem {
  type: 'link';
  path: string;
  label: string;
  icon: LucideIcon;
  /** Roles that can access this route. Empty = none. */
  roles: UserRole[];
}

/**
 * Sidebar menu group (expandable section with children)
 */
export interface SidebarGroupItem {
  type: 'group';
  label: string;
  icon?: LucideIcon;
  children: Omit<SidebarLinkItem, 'type'>[];
}

export type SidebarItemConfig = SidebarLinkItem | SidebarGroupItem;

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Current user role - items are filtered by allowed roles */
  userRole: UserRole;
}
