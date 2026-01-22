/**
 * PageHeader component
 * Standard page header with title, description and action button
 */

import React from 'react';
import { cn } from '@common/helpers';
import { Title, Label } from '@components';
import type { PageHeaderProps } from './PageHeader.type';

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, action, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-8 flex items-center justify-between', className)}
      >
        <div>
          <Title variant="h2" className="mb-2 text-foreground font-semibold">
            {title}
          </Title>
          {description && (
            <Label as="p" className="text-gray-600 dark:text-gray-400">
              {description}
            </Label>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';

export default PageHeader;
