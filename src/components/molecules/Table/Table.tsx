/**
 * Table component
 * Reusable table component built with @tanstack/react-table
 */

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { cn } from '@common/helpers';
import { Button, Label } from '@components';
import type { TableProps, TablePaginationProps } from './Table.type';

/**
 * Table Pagination Component
 */
export const TablePagination: React.FC<TablePaginationProps> = ({
  pageIndex,
  pageSize,
  totalPages,
  total,
  onPageChange,
  showPagination = true,
}) => {
  if (!showPagination || totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-4">
      <Label className="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {pageSize * pageIndex + 1} a {Math.min(pageSize * (pageIndex + 1), total)} de{' '}
        {total} resultados
      </Label>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          Anterior
        </Button>
        <Label className="flex items-center px-3 text-sm">
          Página {pageIndex + 1} de {totalPages}
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex >= totalPages - 1}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

/**
 * Table Component
 */
export function Table<TData>({
  data,
  columns,
  loading = false,
  onRowClick,
  className,
}: TableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // We handle pagination manually
    pageCount: -1, // Required for manual pagination
  });

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-600 dark:text-gray-400">
        Carregando...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-gray-600 dark:text-gray-400">
        Nenhum registro encontrado
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => {
                const align = (header.column.columnDef.meta as { align?: 'left' | 'center' | 'right' })?.align;
                return (
                <th
                  key={header.id}
                  className={cn(
                    'py-3 px-4 font-semibold',
                    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                  )}
                  style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                'border-b border-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick && onRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => {
                const align = (cell.column.columnDef.meta as { align?: 'left' | 'center' | 'right' })?.align;
                return (
                <td
                  key={cell.id}
                  className={cn(
                    'py-3 px-4',
                    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
