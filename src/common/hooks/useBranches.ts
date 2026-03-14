/**
 * Hook para carregar lista de filiais e obter nome por ID.
 * Evita duplicar listBranches + getBranchName em várias telas.
 */
import { useState, useEffect, useCallback } from 'react';
import { listBranches } from '@services/branches';
import type { Branch } from '@services/branches';

const DEFAULT_PAGE_SIZE = 200;

export function useBranches(options?: { pageSize?: number }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const pageSize = options?.pageSize ?? DEFAULT_PAGE_SIZE;

  const load = useCallback(async () => {
    try {
      const res = await listBranches({
        pageSize,
        sort: { fields: ['name'], order: ['ASC'] },
      });
      setBranches(res.data);
    } catch {
      setBranches([]);
    }
  }, [pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const getBranchName = useCallback(
    (branchId: string): string => {
      const b = branches.find((x) => x.id === branchId);
      if (!b) return branchId.slice(0, 8) + '…';
      return b.nickname ? `${b.name} (${b.nickname})` : b.name;
    },
    [branches]
  );

  return { branches, getBranchName, reloadBranches: load };
}
