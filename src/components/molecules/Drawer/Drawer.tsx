/**
 * Drawer component
 * Slide-in panel for mobile (filters, menus, etc)
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@common/helpers';
import { Card, Icon, Button } from '@components';
import type { DrawerProps } from './Drawer.type';

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      side = 'right',
      showCloseButton = true,
      className,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) onClose();
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sideClasses =
      side === 'right'
        ? 'right-0 translate-x-0'
        : 'left-0 translate-x-0';

    return (
      <div
        className="fixed inset-0 z-50 md:hidden"
        aria-modal="true"
        role="dialog"
        {...props}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <div
          ref={ref}
          className={cn(
            'fixed top-0 bottom-0 w-full max-w-sm bg-background shadow-xl flex flex-col z-10',
            sideClasses,
            side === 'right' ? 'animate-drawer-in-right' : 'animate-drawer-in-left',
            className
          )}
        >
          <Card className="flex-1 flex flex-col rounded-none border-0 border-r border-border m-0 overflow-hidden">
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                {title && (
                  <h2 className="text-lg font-semibold">{title}</h2>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 ml-auto"
                    aria-label="Fechar"
                  >
                    <Icon icon={X} size={16} />
                  </Button>
                )}
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </Card>
        </div>
      </div>
    );
  }
);

Drawer.displayName = 'Drawer';

export default Drawer;
