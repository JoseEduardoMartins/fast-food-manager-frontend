/**
 * useEditBranch Hook
 * Custom hook for edit branch page logic
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getBranchById, updateBranch } from '@services/branches';
import { getAddressById, createAddress, updateAddress } from '@services/addresses';
import type { Branch, UpdateBranchRequest } from '@services/branches';
import { branchFormSchema, type BranchFormData } from '../schemas';
import { ROUTES } from '@common/constants';

export const useEditBranch = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressData, setAddressData] = useState<any>(null);

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
        const address = await getAddressById(branchData.addressId);
        addressData = {
          street: address.street,
          number: address.number || '',
          complement: address.complement || '',
          zipcode: address.zipcode || '',
          countryId: address.countryId,
          stateId: address.stateId,
          cityId: address.cityId,
        };
        setAddressData(addressData);
      } catch (err) {
        console.error('Erro ao carregar endereço:', err);
        // Continue with empty address if not found
      }
      
      form.reset({
        name: branchData.name,
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

  const onSubmit = async (data: BranchFormData) => {
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
      } else if (addressData && data.addressId !== branch?.addressId) {
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

      const updateData: UpdateBranchRequest = {
        name: data.name,
        companyId: data.companyId,
        menuId: data.menuId,
        addressId: finalAddressId,
        phone: data.phone || undefined,
        isActive: data.isActive,
      };

      await updateBranch(id, updateData);
      toast.success('Filial atualizada com sucesso!');
      navigate(`${ROUTES.BRANCHES}/${id}`);
    } catch (err: any) {
      console.error('Erro ao atualizar filial:', err);
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar filial';
      
      if (err.response?.status === 404) {
        setError('Empresa, menu ou endereço não encontrado');
        toast.error('Empresa, menu ou endereço não encontrado');
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
    navigate(`${ROUTES.BRANCHES}/${id}`);
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

  const reloadBranch = () => {
    loadBranch();
  };

  return {
    branch,
    loading,
    saving,
    error,
    setError,
    form,
    onSubmit,
    handleCancel,
    reloadBranch,
    handleAddressDataChange,
  };
};
