/**
 * Icon component types
 */

import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';

export interface IconProps extends Omit<HTMLAttributes<SVGSVGElement>, 'color'> {
  icon: LucideIcon;
  size?: number | string;
  color?: string;
  className?: string;
}
