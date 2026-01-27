/**
 * useBranchList Hook
 * Custom hook for branch list page logic
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { listBranches, deleteBranch } from '@services/branches';
import type { Branch, ListBranchesParams } from '@services/branches';

export const useBranchList = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchName, setSearchName] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const loadBranches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ListBranchesParams = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        // Não especificamos selectFields para receber dados completos da empresa via leftJoin
      };

      if (selectedStatus !== 'all') {
        params.isActive = selectedStatus === 'active';
      }

      if (searchName) {
        params.name = searchName;
      }

      if (selectedCompany !== 'all') {
        params.companyId = selectedCompany;
      }

      const response = await listBranches(params);
      
      setBranches(response.data);
      setPagination({
        total: response.total,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      console.error('Erro ao carregar filiais:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao carregar filiais';
      setError(errorMessage);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchName, selectedCompany, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const handleDelete = async (id: string, branchName: string): Promise<void> => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a filial "${branchName}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBranch(id);
      toast.success('Filial excluída com sucesso!');
      await loadBranches();
    } catch (err: any) {
      console.error('Erro ao excluir filial:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao excluir filial';
      
      if (err.response?.status === 409) {
        toast.error('Filial possui relacionamentos e não pode ser deletada');
      } else {
        toast.error(errorMessage);
      }
      
      setError(errorMessage);
    }
  };

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSelectedCompany('all');
    setSelectedStatus('all');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return {
    branches,
    loading,
    error,
    selectedCompany,
    setSelectedCompany,
    selectedStatus,
    setSelectedStatus,
    searchName,
    setSearchName,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
  };
};
