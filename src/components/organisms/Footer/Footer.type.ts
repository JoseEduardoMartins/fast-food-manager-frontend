import type { HTMLAttributes } from 'react';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  onNavigate?: (route: string) => void;
}
