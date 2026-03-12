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
  /** Permissions: user needs at least one to see (when permissions are used) */
  permission?: string;
  /** Roles that can access (fallback when permissions not used or empty) */
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
  userRole: UserRole;
  /** User permissions from backend; when length > 0, items are filtered by permission */
  permissions?: string[];
  /** Check if user has permission */
  hasPermission?: (permission: string) => boolean;
}
