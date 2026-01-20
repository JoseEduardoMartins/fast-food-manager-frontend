import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { VariantProps } from '../../../utils';
import { buttonVariants } from './Button.style';

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  children?: ReactNode;
}
