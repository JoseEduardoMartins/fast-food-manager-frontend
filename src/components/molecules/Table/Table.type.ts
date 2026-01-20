/**
 * Table component types
 */

import type { ColumnDef, Table as TanStackTable } from '@tanstack/react-table';

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  loading?: boolean;
  onRowClick?: (row: TData) => void;
  className?: string;
}

export interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  total: number;
  onPageChange: (pageIndex: number) => void;
  showPagination?: boolean;
}

export type TableInstance<TData> = TanStackTable<TData>;
