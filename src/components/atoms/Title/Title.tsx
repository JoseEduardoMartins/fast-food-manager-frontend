import React from 'react';
import { cn } from '../../../common/helpers';
import type { TitleProps } from './Title.type';
import { titleVariants } from './Title.style';

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, variant = 'h1', children, ...props }, ref) => {
    const Component = variant;
    return (
      <Component
        ref={ref}
        className={cn(titleVariants[variant], 'text-foreground', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Title.displayName = 'Title';

export default Title;
