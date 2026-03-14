/**
 * useBranchDetails Hook
 * Custom hook for branch details/view page logic
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getBranchById, updateBranch, deleteBranch } from '@services/branches';
import type { Branch } from '@services/branches';
import { branchFormSchema, type BranchFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useBranchDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
  });

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.BRANCHES);
      return;
    }
    loadBranch();
  }, [id]);

  const loadBranch = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const branchData = await getBranchById(id);
      setBranch(branchData);
      
      // Address data will be loaded by AddressSelector component
      
      form.reset({
        name: branchData.name,
        nickname: branchData.nickname,
        companyId: branchData.companyId,
        menuId: branchData.menuId,
        addressId: branchData.addressId,
        phone: branchData.phone || '',
        isActive: branchData.isActive,
      });
      
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar filial:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao carregar filial';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!id || !branch) return;

    try {
      setToggling(true);
      setError(null);
      await updateBranch(id, { isActive: !branch.isActive });
      toast.success(
        `Filial ${branch.isActive ? 'desativada' : 'ativada'} com sucesso!`
      );
      await loadBranch(); // Reload branch data to reflect status change
    } catch (err: any) {
      console.error('Erro ao alterar status da filial:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao alterar status da filial';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !branch) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a filial "${branch.name}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBranch(id);
      toast.success('Filial excluída com sucesso!');
      navigate(ROUTES.BRANCHES);
    } catch (err: any) {
      console.error('Erro ao excluir filial:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao excluir filial';
      if (err.response?.status === 409) {
        setError('Filial possui relacionamentos e não pode ser excluída.');
        toast.error('Filial possui relacionamentos e não pode ser excluída.');
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(`${ROUTES.BRANCHES}/${id}/edit`);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.BRANCHES);
  };

  const reloadBranch = () => {
    loadBranch();
  };

  return {
    branch,
    loading,
    error,
    setError,
    toggling,
    form,
    handleToggleActive,
    handleDelete,
    handleEdit,
    handleBack,
    reloadBranch,
  };
};
