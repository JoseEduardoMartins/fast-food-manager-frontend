/**
 * FormField component types
 */

import type { ReactNode, InputHTMLAttributes } from 'react';

export interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'label'> {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  errorText?: ReactNode;
}
