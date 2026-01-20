/**
 * Icon component
 * Centralized icon component using lucide-react
 */

import React from 'react';
import { cn } from '@common/helpers';
import type { IconProps } from './Icon.type';

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, size = 24, color, className, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        size={typeof size === 'string' ? size : size}
        color={color}
        className={cn(className)}
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

export default Icon;
