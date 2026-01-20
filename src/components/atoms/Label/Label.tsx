import React from 'react';
import { cn } from '@common/helpers';
import type { LabelProps } from './Label.type';

const Label = React.forwardRef<
  HTMLLabelElement | HTMLParagraphElement | HTMLSpanElement,
  LabelProps
>(({ className, as = 'label', children, ...props }, ref) => {
  const Component = as;
  return (
    <Component ref={ref as never} className={cn('text-foreground', className)} {...props}>
      {children}
    </Component>
  );
});

Label.displayName = 'Label';

export default Label;
