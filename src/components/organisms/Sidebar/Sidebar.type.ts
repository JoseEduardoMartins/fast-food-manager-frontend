import type { HTMLAttributes } from 'react';
import type { UserRole } from '@services/auth';
import type { LucideIcon } from 'lucide-react';

/**
 * Sidebar menu item configuration
 */
export interface SidebarItemConfig {
  path: string;
  label: string;
  icon: LucideIcon;
  /** Roles that can access this route. Empty = none. */
  roles: UserRole[];
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Current user role - items are filtered by allowed roles */
  userRole: UserRole;
}
