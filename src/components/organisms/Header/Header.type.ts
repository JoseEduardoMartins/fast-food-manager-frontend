import type { HTMLAttributes } from 'react';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  onNavigate?: (route: string) => void;
}
