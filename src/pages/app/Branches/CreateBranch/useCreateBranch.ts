/**
 * useCreateBranch Hook
 * Custom hook for create branch page logic
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createBranch } from '@services/branches';
import { createAddress } from '@services/addresses';
import type { CreateBranchRequest } from '@services/branches';
import { branchFormSchema, type BranchFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useCreateBranch = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<any>(null);

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: '',
      companyId: '',
      menuId: '',
      addressId: '',
      phone: '',
    },
  });

  const onSubmit = async (data: BranchFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      let finalAddressId = data.addressId;

      // If addressId is a temporary ID (starts with 'temp-'), create the address first
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

      const createData: CreateBranchRequest = {
        name: data.name,
        companyId: data.companyId,
        menuId: data.menuId,
        addressId: finalAddressId,
        phone: data.phone || undefined,
        // isActive is always true on creation, not sent in request body
      };

      const response = await createBranch(createData);
      toast.success('Filial criada com sucesso!');
      navigate(`${ROUTES.BRANCHES}/${response.id}`);
    } catch (err: unknown) {
      console.error('Erro ao criar filial:', err);
      const error = err as { response?: { data?: { message?: string }; status?: number } };
      const errorMessage = error.response?.data?.message || 'Erro ao criar filial';

      if (error.response?.status === 404) {
        setError('Empresa, menu ou endereço não encontrado');
        toast.error('Empresa, menu ou endereço não encontrado');
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.BRANCHES);
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
    handleAddressDataChange,
  };
};
