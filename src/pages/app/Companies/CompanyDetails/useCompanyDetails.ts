/**
 * useCompanyDetails Hook
 * Custom hook for company details/view page logic
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getCompanyById, updateCompany, deleteCompany } from '@services/companies';
import type { Company } from '@services/companies';
import { companyFormSchema, type CompanyFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCompanyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
  });

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
      
      form.reset({
        name: companyData.name,
        cnpj: companyData.cnpj,
        phone: companyData.phone || '',
        addressId: companyData.addressId,
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
    loading,
    error,
    setError,
    toggling,
    form,
    handleToggleActive,
    handleDelete,
    handleEdit,
    handleBack,
    reloadCompany,
  };
};
