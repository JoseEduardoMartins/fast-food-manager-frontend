/**
 * FilterBar component types
 * Search input + filter button; filters open em drawer lateral (desktop) ou bottom sheet (mobile, arrastar pra baixo)
 */

import type { ReactNode, HTMLAttributes } from 'react';

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Search input - ocupa a maior parte da largura. Opcional - páginas só com filtros podem omitir */
  searchSlot?: ReactNode;
  /** Conteúdo dos filtros (exibido no Dialog/Drawer). Opcional - páginas só com busca podem omitir */
  filterContent?: ReactNode;
  /** Título do painel de filtros */
  filterTitle?: string;
  onFilter: () => void;
  onClear: () => void;
  filterLabel?: ReactNode;
  clearLabel?: ReactNode;
}
