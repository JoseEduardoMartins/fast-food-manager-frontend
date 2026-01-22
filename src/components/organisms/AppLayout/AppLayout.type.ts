import type { HTMLAttributes, ReactNode } from 'react';
import type { User } from '@services/auth';

export interface AppLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  user: User | null;
  onSignOut: () => void;
}
