/**
 * Modal component
 * Reusable modal dialog component
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@common/helpers';
import { Card, Icon, Button } from '@components';
import type { ModalProps } from './Modal.type';

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, size = 'md', showCloseButton = true, className, ...props }, ref) => {
    // Close modal on Escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        {...props}
      >
        <Card
          ref={ref}
          className={cn('w-full relative', sizeClasses[size], className)}
          onClick={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              {title && (
                <h2 className="text-xl font-semibold">{title}</h2>
              )}
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                  aria-label="Fechar modal"
                >
                  <Icon icon={X} size={16} />
                </Button>
              )}
            </div>
          )}
          {children}
        </Card>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
