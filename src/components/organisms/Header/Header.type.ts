import type { HTMLAttributes } from 'react';
import type { User } from '@services/auth';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  onNavigate?: (route: string) => void;
  user?: User | null;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
}
