import { cva } from '@common/helpers';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-hover',
        secondary: 'bg-secondary text-white hover:bg-secondary-hover',
        success: 'bg-success text-white hover:bg-success-hover',
        error: 'bg-error text-white hover:bg-error-hover',
        warning: 'bg-warning text-white hover:bg-warning-hover',
        info: 'bg-info text-white hover:bg-info-hover',
        outline: 'border border-border bg-background hover:bg-gray-50 dark:hover:bg-gray-900',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-11 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
