/**
 * ErrorAlert component
 * Displays error messages in a consistent format
 */

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@common/helpers';
import { Card, Label, Icon, Button } from '@components';
import type { ErrorAlertProps } from './ErrorAlert.type';

const ErrorAlert = React.forwardRef<HTMLDivElement, ErrorAlertProps>(
  ({ message, onDismiss, dismissible = false, className, ...props }, ref) => {
    if (!message) return null;

    return (
      <Card
        ref={ref}
        className={cn('mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', className)}
        {...props}
      >
        <div className="flex items-center justify-between gap-4">
          <Label className="text-red-600 dark:text-red-400 flex-1">{message}</Label>
          {dismissible && onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 text-red-600 dark:text-red-400"
              aria-label="Fechar"
            >
              <Icon icon={X} size={14} />
            </Button>
          )}
        </div>
      </Card>
    );
  }
);

ErrorAlert.displayName = 'ErrorAlert';

export default ErrorAlert;
