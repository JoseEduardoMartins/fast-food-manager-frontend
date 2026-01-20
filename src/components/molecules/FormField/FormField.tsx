/**
 * FormField component
 * Combines Label and Input for reusable form fields
 */

import React from 'react';
import { cn } from '@common/helpers';
import { Label, Input } from '@components';
import type { FormFieldProps } from './FormField.type';

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, helperText, error, errorText, className, ...inputProps }, ref) => {
    return (
      <div className={cn('space-y-2', className)}>
        {label && (
          <Label className="block">
            {label}
            {inputProps.required && <span className="text-error ml-1">*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          error={error || !!errorText}
          {...inputProps}
        />
        {errorText && (
          <p className="text-sm text-error">{errorText}</p>
        )}
        {helperText && !errorText && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
