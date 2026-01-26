/**
 * useCreateCompany Hook
 * Custom hook for create company page logic
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createCompany } from '@services/companies';
import { createAddress } from '@services/addresses';
import type { CreateCompanyRequest } from '@services/companies';
import { companyFormSchema, type CompanyFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCreateCompany = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<any>(null);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      cnpj: '',
      phone: '',
      addressId: '',
      isActive: true,
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // First, create the address if we have address data
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
      }

      const createData: CreateCompanyRequest = {
        name: data.name,
        cnpj: data.cnpj,
        phone: data.phone || undefined,
        addressId: finalAddressId,
        isActive: data.isActive ?? true,
      };

      const response = await createCompany(createData);
      toast.success('Empresa criada com sucesso!');
      navigate(`${ROUTES.COMPANIES}/${response.id}`);
    } catch (err: unknown) {
      console.error('Erro ao criar empresa:', err);
      const error = err as { response?: { data?: { message?: string }; status?: number } };
      const errorMessage = error.response?.data?.message || 'Erro ao criar empresa';
      
      if (error.response?.status === 409) {
        setError('CNPJ já está em uso');
        toast.error('CNPJ já está em uso');
      } else if (error.response?.status === 404) {
        setError('Endereço não encontrado');
        toast.error('Endereço não encontrado');
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.COMPANIES);
  };

  const handleAddressChange = (id: string) => {
    setAddressId(id);
    form.setValue('addressId', id);
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

  return {
    form,
    isLoading,
    error,
    setError,
    onSubmit,
    handleCancel,
    addressId,
    handleAddressChange,
    handleAddressDataChange,
  };
};
