import React from 'react';
import { cn } from '@common/helpers';
import Header from '../Header';
import Footer from '../Footer';
import type { LayoutProps } from './Layout.type';

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ className, children, headerProps, footerProps, showHeader = true, showFooter = true, ...props }, ref) => {
    // Hide footer for authenticated users
    const shouldShowFooter = showFooter && footerProps !== null && !footerProps?.isAuthenticated;
    
    return (
      <div
        ref={ref}
        className={cn('flex min-h-screen flex-col', className)}
        {...props}
      >
        {showHeader && headerProps !== null && <Header {...headerProps} />}
        <main className="flex-1">{children}</main>
        {shouldShowFooter && <Footer {...footerProps} />}
      </div>
    );
  }
);

Layout.displayName = 'Layout';

export default Layout;
