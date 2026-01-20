import React from 'react';
import { cn } from '../../../common/helpers';
import type { DividerProps } from './Divider.type';

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn(
          'shrink-0 border-border',
          orientation === 'horizontal' ? 'my-4 w-full' : 'mx-4 h-full',
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export default Divider;
