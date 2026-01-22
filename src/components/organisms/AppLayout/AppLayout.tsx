import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@common/helpers';
import Header from '../Header';
import Sidebar from '../Sidebar';
import type { AppLayoutProps } from './AppLayout.type';

/**
 * AppLayout - Layout for authenticated users with Sidebar
 * Replaces Layout for authenticated app pages
 */
const AppLayout = React.forwardRef<HTMLDivElement, AppLayoutProps>(
  ({ className, children, user, onSignOut, ...props }, ref) => {
    const navigate = useNavigate();

    return (
      <div
        ref={ref}
        className={cn('flex min-h-screen flex-col', className)}
        {...props}
      >
        <Header
          onNavigate={(route) => navigate(route)}
          user={user}
          isAuthenticated={true}
          onSignOut={onSignOut}
        />
        <div className="flex flex-1">
          {user && <Sidebar userRole={user.role} />}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    );
  }
);

AppLayout.displayName = 'AppLayout';

export default AppLayout;
