/**
 * FilterForm component
 * Reusable filter form with search and clear buttons
 */

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@common/helpers';
import { Card, Button, Icon } from '@components';
import type { FilterFormProps } from './FilterForm.type';

const FilterForm = React.forwardRef<HTMLDivElement, FilterFormProps>(
  ({ children, onSearch, onClear, searchLabel = 'Buscar', clearLabel = 'Limpar', className, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn('mb-6 p-4', className)} {...props}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {children}
        </div>
        <div className="flex gap-2">
          <Button onClick={onSearch}>
            <Icon icon={Search} size={16} className="mr-2" />
            {searchLabel}
          </Button>
          <Button onClick={onClear} variant="outline">
            <Icon icon={X} size={16} className="mr-2" />
            {clearLabel}
          </Button>
        </div>
      </Card>
    );
  }
);

FilterForm.displayName = 'FilterForm';

export default FilterForm;
