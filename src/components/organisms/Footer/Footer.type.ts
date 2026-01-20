import type { HTMLAttributes } from 'react';
import type { User } from '@services/auth';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  onNavigate?: (route: string) => void;
  user?: User | null;
  isAuthenticated?: boolean;
}
