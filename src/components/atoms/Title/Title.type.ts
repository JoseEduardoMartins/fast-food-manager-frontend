import type { HTMLAttributes, ReactNode } from 'react';
import type { titleVariants } from './Title.style';

export type TitleVariant = keyof typeof titleVariants;

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  variant?: TitleVariant;
  children?: ReactNode;
}
