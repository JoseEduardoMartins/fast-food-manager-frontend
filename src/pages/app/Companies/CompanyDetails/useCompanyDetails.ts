/**
 * useCompanyDetails Hook
 * Custom hook for company details/view page logic
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getCompanyById, updateCompany, deleteCompany } from '@services/companies';
import { getAddressById } from '@services/addresses';
import { listBranches, deleteBranch } from '@services/branches';
import type { Company } from '@services/companies';
import type { Branch } from '@services/branches';
import { companyFormSchema, type CompanyFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCompanyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
  });

  const loadBranches = useCallback(async () => {
    if (!id) return;
    try {
      setBranchesLoading(true);
      const res = await listBranches({ companyId: id, pageSize: 200 });
      setBranches(res.data);
    } catch (err) {
      setBranches([]);
    } finally {
      setBranchesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.COMPANIES);
      return;
    }
    loadCompany();
  }, [id]);

  const loadCompany = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const companyData = await getCompanyById(id);
      setCompany(companyData);
      
      // Load branches for this company
      loadBranches();
      
      // Fetch address data to populate form
      let addressData = {
        street: '',
        number: '',
        complement: '',
        zipcode: '',
        countryId: '',
        stateId: '',
        cityId: '',
      };

      try {
        const address = await getAddressById(companyData.addressId);
        addressData = {
          street: address.street,
          number: address.number || '',
          complement: address.complement || '',
          zipcode: address.zipcode || '',
          countryId: address.countryId,
          stateId: address.stateId,
          cityId: address.cityId,
        };
      } catch (err) {
        console.error('Erro ao carregar endereço:', err);
        // Continue with empty address if not found
      }
      
      form.reset({
        name: companyData.name,
        cnpj: companyData.cnpj,
        phone: companyData.phone || '',
        address: addressData,
        isActive: companyData.isActive,
      });
      
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar empresa:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao carregar empresa';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!company) return;

    try {
      setToggling(true);
      setError(null);
      await updateCompany(company.id, { isActive: !company.isActive });
      toast.success(`Empresa ${company.isActive ? 'desativada' : 'ativada'} com sucesso!`);
      await loadCompany();
    } catch (err: any) {
      console.error('Erro ao alterar status da empresa:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao alterar status da empresa';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!company) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a empresa "${company.name}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);
      await deleteCompany(company.id);
      toast.success('Empresa excluída com sucesso!');
      navigate(ROUTES.COMPANIES);
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

  const handleDeleteBranch = async (branchId: string, branchName: string) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a filial "${branchName}"?`
    );
    if (!confirmed) return;
    try {
      await deleteBranch(branchId);
      toast.success('Filial excluída com sucesso!');
      await loadBranches();
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Erro ao excluir filial';
      toast.error(msg);
      setError(msg);
    }
  };

  const handleEdit = () => {
    if (!id) return;
    navigate(`${ROUTES.COMPANIES}/${id}/edit`);
  };

  const handleBack = () => {
    navigate(ROUTES.COMPANIES);
  };

  const reloadCompany = () => {
    loadCompany();
  };

  return {
    company,
    branches,
    branchesLoading,
    loading,
    error,
    setError,
    toggling,
    form,
    handleToggleActive,
    handleDelete,
    handleDeleteBranch,
    handleEdit,
    handleBack,
    reloadCompany,
    loadBranches,
  };
};
