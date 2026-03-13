/**
 * AddressSelector Component for Branches
 * Manages a single address for branches
 * Cria endereço inline e armazena addressId no form
 * Integrado com AddressFormFields unificado (cascata país→estado→cidade)
 */

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { Card, Icon, Label, AddressFormFields } from '@components';
import { getAddressById } from '@services/addresses';
import type { AddressSelectorProps } from './AddressSelector.type';
import type { BranchFormData } from '../schemas';

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  mode,
  disabled = false,
  onAddressDataChange,
}) => {
  const { watch, setValue } = useFormContext<BranchFormData>();

  const addressId = watch('addressId');
  const isViewOnly = mode === 'view';

  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    zipcode: '',
    countryId: '',
    stateId: '',
    cityId: '',
  });

  useEffect(() => {
    if (addressId && (mode === 'view' || mode === 'edit')) {
      const loadAddress = async () => {
        try {
          const addressData = await getAddressById(addressId);
          setAddress({
            street: addressData.street,
            number: addressData.number || '',
            complement: addressData.complement || '',
            zipcode: addressData.zipcode || '',
            countryId: addressData.countryId,
            stateId: addressData.stateId,
            cityId: addressData.cityId,
          });
        } catch (error) {
          console.error('Erro ao carregar endereço:', error);
        }
      };
      loadAddress();
    }
  }, [addressId, mode]);

  const handleChange = (v: { street: string; number?: string; complement?: string; zipcode?: string; countryId: string; stateId: string; cityId: string }) => {
    const next = {
      street: v.street,
      number: v.number ?? '',
      complement: v.complement ?? '',
      zipcode: v.zipcode ?? '',
      countryId: v.countryId,
      stateId: v.stateId,
      cityId: v.cityId,
    };
    setAddress(next);

    if (next.street && next.countryId && next.stateId && next.cityId) {
      setValue('addressId', `temp-${Date.now()}`);
      onAddressDataChange?.(next);
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold flex items-center gap-2">
        <Icon icon={MapPin} size={20} />
        Endereço
        {!isViewOnly && <span className="text-error ml-1">*</span>}
      </Label>

      <Card className="p-4">
        <AddressFormFields
          value={address}
          onChange={handleChange}
          disabled={disabled || isViewOnly}
          showLabelAndDefault={false}
          required={!isViewOnly}
        />
      </Card>
    </div>
  );
};
