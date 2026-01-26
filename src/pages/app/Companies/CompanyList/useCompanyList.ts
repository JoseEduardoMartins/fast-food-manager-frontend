/**
 * useCompanyList Hook
 * Custom hook for company list page logic
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { listCompanies, deleteCompany } from '@services/companies';
import type { Company, ListCompaniesParams } from '@services/companies';

export const useCompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchName, setSearchName] = useState('');
  const [searchCnpj, setSearchCnpj] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: ListCompaniesParams = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        selectFields: ['id', 'name', 'cnpj', 'phone', 'isActive', 'createdAt'],
      };

      if (selectedStatus !== 'all') {
        params.isActive = selectedStatus === 'active';
      }

      if (searchName) {
        params.name = searchName;
      }

      if (searchCnpj) {
        params.cnpj = searchCnpj;
      }

      const response = await listCompanies(params);
      
      setCompanies(response.data);
      setPagination({
        total: response.total,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      console.error('Erro ao carregar empresas:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao carregar empresas';
      setError(errorMessage);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchName, searchCnpj, pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleDelete = async (id: string, companyName: string): Promise<void> => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a empresa "${companyName}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCompany(id);
      toast.success('Empresa excluída com sucesso!');
      await loadCompanies();
    } catch (err: any) {
      console.error('Erro ao excluir empresa:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao excluir empresa';
      
      if (err.response?.status === 409) {
        toast.error('Empresa possui relacionamentos e não pode ser deletada');
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
    setSearchCnpj('');
    setSelectedStatus('all');
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return {
    companies,
    loading,
    error,
    selectedStatus,
    setSelectedStatus,
    searchName,
    setSearchName,
    searchCnpj,
    setSearchCnpj,
    pagination,
    handleDelete,
    handlePageChange,
    handleSearch,
    handleClearSearch,
    setError,
  };
};
