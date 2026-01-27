/**
 * useEditCompany Hook
 * Custom hook for edit company page logic
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getCompanyById, updateCompany } from '@services/companies';
import { getAddressById } from '@services/addresses';
import type { Company, UpdateCompanyRequest } from '@services/companies';
import { companyFormSchema, type CompanyFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useEditCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const onSubmit = async (data: CompanyFormData) => {
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      // Send address inline - backend will update/create it automatically
      const updateData: UpdateCompanyRequest = {
        name: data.name,
        cnpj: data.cnpj,
        phone: data.phone || undefined,
        address: {
          street: data.address.street,
          number: data.address.number || undefined,
          complement: data.address.complement || undefined,
          zipcode: data.address.zipcode || undefined,
          countryId: data.address.countryId,
          stateId: data.address.stateId,
          cityId: data.address.cityId,
        },
        isActive: data.isActive,
      };

      await updateCompany(id, updateData);
      toast.success('Empresa atualizada com sucesso!');
      navigate(`${ROUTES.COMPANIES}/${id}`);
    } catch (err: any) {
      console.error('Erro ao atualizar empresa:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar empresa';
      
      if (err.response?.status === 409) {
        setError('CNPJ já está em uso');
        toast.error('CNPJ já está em uso');
      } else if (err.response?.status === 404) {
        setError('País, estado ou cidade não encontrado');
        toast.error('País, estado ou cidade não encontrado');
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!id) return;
    navigate(`${ROUTES.COMPANIES}/${id}`);
  };

  const reloadCompany = () => {
    loadCompany();
  };

  return {
    company,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
    reloadCompany,
  };
};
