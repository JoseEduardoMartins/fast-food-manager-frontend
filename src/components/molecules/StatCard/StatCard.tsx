/**
 * StatCard component
 * Displays statistics in a card format
 */

import React from 'react';
import { cn } from '@common/helpers';
import { Card, Title, Label, Icon } from '@components';
import type { StatCardProps } from './StatCard.type';

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, description, icon, onClick, route, className, ...props }, ref) => {
    const hasClick = !!onClick || !!route;

    return (
      <Card
        ref={ref}
        className={cn(
          'p-6 flex flex-col items-start text-left hover:border-primary transition-colors',
          hasClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
        {...props}
      >
        {icon && (
          <div className="flex items-start justify-between mb-4 w-full">
            <div className="text-primary">
              <Icon icon={icon} size={32} />
            </div>
            <Title variant="h2" className="text-primary font-bold text-3xl">
              {String(value)}
            </Title>
          </div>
        )}
        {!icon && (
          <Title variant="h2" className="mb-3 text-primary font-bold text-3xl">
            {value}
          </Title>
        )}
        <Label as="p" className="font-semibold mb-2 text-foreground">
          {title}
        </Label>
        {description && (
          <Label as="p" className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {description}
          </Label>
        )}
      </Card>
    );
  }
);

StatCard.displayName = 'StatCard';

export default StatCard;
