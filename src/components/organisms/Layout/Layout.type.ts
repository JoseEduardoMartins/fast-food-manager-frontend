import type { HTMLAttributes, ReactNode } from 'react';
import type { HeaderProps } from '../Header';
import type { FooterProps } from '../Footer';

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  headerProps?: HeaderProps | null;
  footerProps?: FooterProps | null;
  showHeader?: boolean;
  showFooter?: boolean;
}
