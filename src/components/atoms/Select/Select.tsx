import React from 'react';
import { cn } from '../../../common/helpers';
import Label from '../Label';
import type { SelectProps } from './Select.type';

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error = false, helperText, id, children, ...props },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <Label htmlFor={selectId} className="text-sm font-medium">
            {label}
          </Label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus-visible:ring-error',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {helperText && (
          <p
            className={cn(
              'text-sm',
              error ? 'text-error' : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
