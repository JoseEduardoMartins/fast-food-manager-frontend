/**
 * FilterForm component types
 */

import type { ReactNode, HTMLAttributes } from 'react';

export interface FilterFormProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onSearch: () => void;
  onClear: () => void;
  searchLabel?: ReactNode;
  clearLabel?: ReactNode;
}
