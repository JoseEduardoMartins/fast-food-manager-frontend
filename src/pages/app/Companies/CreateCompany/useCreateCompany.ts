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
import type { CreateCompanyRequest } from '@services/companies';
import { companyFormSchema, type CompanyFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCreateCompany = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      cnpj: '',
      phone: '',
      address: {
        street: '',
        number: '',
        complement: '',
        zipcode: '',
        countryId: '',
        stateId: '',
        cityId: '',
      },
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Send address inline - backend will create it automatically
      const createData: CreateCompanyRequest = {
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
        // isActive is not available in creation - always true
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
        setError('País, estado ou cidade não encontrado');
        toast.error('País, estado ou cidade não encontrado');
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

  return {
    form,
    isLoading,
    error,
    setError,
    onSubmit,
    handleCancel,
  };
};
