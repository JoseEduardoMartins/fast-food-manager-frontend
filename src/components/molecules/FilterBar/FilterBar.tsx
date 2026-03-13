/**
 * FilterBar component
 * Barra de busca com input ocupando a maior parte + botão para abrir filtros.
 * Desktop: filtros em drawer lateral (direita) | Mobile: filtros em bottom sheet (arrastar pra baixo pra fechar)
 */

import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { Filter, X } from 'lucide-react';
import { cn } from '@common/helpers';
import { Button, Icon } from '@components';
import { useMediaQuery } from '@common/hooks/useMediaQuery';
import type { FilterBarProps } from './FilterBar.type';

const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      searchSlot,
      filterContent,
      filterTitle = 'Filtros',
      onFilter,
      onClear,
      filterLabel = 'Filtrar',
      clearLabel = 'Limpar',
      className,
      ...props
    },
    ref,
  ) => {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const handleFilter = () => {
      onFilter();
      setFiltersOpen(false);
    };

    const handleClear = () => {
      onClear();
      setFiltersOpen(false);
    };

    return (
      <div ref={ref} className={cn('mb-6 flex flex-col gap-4', className)} {...props}>
        {/* Barra: busca + botão filtros */}
        <div className={cn('flex gap-2 items-end w-full', !searchSlot && 'justify-end')}>
          {searchSlot && <div className="flex-1 min-w-0">{searchSlot}</div>}
          <Button
            variant="outline"
            size="default"
            onClick={() => setFiltersOpen(true)}
            className="shrink-0"
            aria-label="Abrir filtros"
          >
            <Icon icon={Filter} size={18} className="md:mr-2" />
            <span className="hidden md:inline">Filtros</span>
          </Button>
        </div>

        {/* Vaul Drawer: lateral no desktop, bottom sheet no mobile */}
        <Drawer.Root
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          direction={isDesktop ? 'right' : 'bottom'}
        >
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50" />
            <Drawer.Content
              className={cn(
                'fixed z-50 bg-background flex flex-col outline-none',
                isDesktop
                  ? 'top-0 right-0 bottom-0 w-full max-w-md border-l border-border shadow-xl rounded-l-[10px]'
                  : 'bottom-0 left-0 right-0 max-h-[90vh] rounded-t-[10px] border-t border-border',
              )}
            >
              {/* Handle para arrastar (mobile) */}
              {!isDesktop && (
                <Drawer.Handle className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600" />
              )}

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
                <Drawer.Title className="text-lg font-semibold">{filterTitle}</Drawer.Title>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltersOpen(false)}
                  className="h-8 w-8 p-0"
                  aria-label="Fechar"
                >
                  <Icon icon={X} size={16} />
                </Button>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {filterContent && (
                  <div
                    className={cn(
                      'gap-4',
                      isDesktop ? 'grid grid-cols-1 md:grid-cols-2' : 'flex flex-col',
                    )}
                  >
                    {filterContent}
                  </div>
                )}
                <div
                  className={cn(
                    'flex pt-4 border-t border-border gap-2',
                    isDesktop ? 'justify-end' : 'flex-col',
                  )}
                >
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    className={isDesktop ? '' : 'w-full'}
                  >
                    <Icon icon={X} size={16} className="mr-2" />
                    {clearLabel}
                  </Button>
                  <Button onClick={handleFilter} className={isDesktop ? '' : 'w-full'}>
                    <Icon icon={Filter} size={16} className="mr-2" />
                    {filterLabel}
                  </Button>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    );
  },
);

FilterBar.displayName = 'FilterBar';

export default FilterBar;
