import type { HTMLAttributes, ReactNode } from 'react';
import type { VariantProps } from '../../../utils';
import { alertVariants } from './Alert.style';

export type AlertVariants = VariantProps<typeof alertVariants>;

export interface AlertProps extends HTMLAttributes<HTMLDivElement>, AlertVariants {
  children?: ReactNode;
}
