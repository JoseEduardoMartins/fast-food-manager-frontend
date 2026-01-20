/**
 * ErrorAlert component types
 */

import type { ReactNode, HTMLAttributes } from 'react';

export interface ErrorAlertProps extends HTMLAttributes<HTMLDivElement> {
  message: ReactNode;
  onDismiss?: () => void;
  dismissible?: boolean;
}
