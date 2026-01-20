import React from 'react';
import { cn } from '../../../utils';
import type { BadgeProps } from './Badge.type';
import { badgeVariants } from './Badge.style';

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props}>
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
