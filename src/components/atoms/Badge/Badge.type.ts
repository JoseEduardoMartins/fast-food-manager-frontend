import type { HTMLAttributes, ReactNode } from 'react';
import type { VariantProps } from '../../../utils';
import { badgeVariants } from './Badge.style';

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, BadgeVariants {
  children?: ReactNode;
}
