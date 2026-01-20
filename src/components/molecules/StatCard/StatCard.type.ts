/**
 * StatCard component types
 */

import type { ReactNode, HTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface StatCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  route?: string;
}
