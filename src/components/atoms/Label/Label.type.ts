import type { LabelHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export interface LabelProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'as'> {
  as?: 'label' | 'p' | 'span';
  children?: ReactNode;
}
