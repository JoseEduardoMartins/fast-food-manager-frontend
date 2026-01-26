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
import { createAddress, updateAddress } from '@services/addresses';
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
  const [addressData, setAddressData] = useState<any>(null);

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

  const onSubmit = async (data: CompanyFormData) => {
    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      let finalAddressId = data.addressId;

      // If addressId is a temporary ID (starts with 'temp-'), create the address
      if (data.addressId.startsWith('temp-') && addressData) {
        const addressResponse = await createAddress({
          street: addressData.street,
          number: addressData.number,
          complement: addressData.complement,
          zipcode: addressData.zipcode,
          countryId: addressData.countryId,
          stateId: addressData.stateId,
          cityId: addressData.cityId,
        });
        finalAddressId = addressResponse.id;
      } else if (addressData && data.addressId !== company?.addressId) {
        // If address data changed and it's not a new address, update it
        await updateAddress(data.addressId, {
          street: addressData.street,
          number: addressData.number,
          complement: addressData.complement,
          zipcode: addressData.zipcode,
          countryId: addressData.countryId,
          stateId: addressData.stateId,
          cityId: addressData.cityId,
        });
      }

      const updateData: UpdateCompanyRequest = {
        name: data.name,
        cnpj: data.cnpj,
        phone: data.phone || undefined,
        addressId: finalAddressId,
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
        setError('Endereço não encontrado');
        toast.error('Endereço não encontrado');
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

  const handleAddressChange = (addressId: string) => {
    form.setValue('addressId', addressId);
  };

  const handleAddressDataChange = (data: {
    street: string;
    number?: string;
    complement?: string;
    zipcode?: string;
    countryId: string;
    stateId: string;
    cityId: string;
  }) => {
    setAddressData(data);
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
    handleAddressChange,
    handleAddressDataChange,
  };
};
