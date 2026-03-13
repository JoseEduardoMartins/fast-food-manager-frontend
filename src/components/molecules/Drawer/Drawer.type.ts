/**
 * Drawer component types
 */

import type { ReactNode, HTMLAttributes } from 'react';

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  /** Side from which drawer slides in */
  side?: 'left' | 'right';
  showCloseButton?: boolean;
}
