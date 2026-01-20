import { cva } from '../../../utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-white hover:bg-primary-hover',
        secondary: 'border-transparent bg-secondary text-white hover:bg-secondary-hover',
        success: 'border-transparent bg-success text-white hover:bg-success-hover',
        error: 'border-transparent bg-error text-white hover:bg-error-hover',
        warning: 'border-transparent bg-warning text-white hover:bg-warning-hover',
        info: 'border-transparent bg-info text-white hover:bg-info-hover',
        outline: 'text-foreground border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
