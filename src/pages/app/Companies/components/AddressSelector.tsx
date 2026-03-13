/**
 * AddressSelector Component
 * Manages a single address for companies (companies have only one required address)
 * Uses React Hook Form context - integrado com AddressFormFields unificado
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { Card, Icon, Label, AddressFormFields } from '@components';
import type { AddressSelectorProps } from './AddressSelector.type';
import type { CompanyFormData } from '../schemas';

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  mode,
  disabled = false,
}) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CompanyFormData>();

  const address = watch('address');
  const isViewOnly = mode === 'view';

  const addressValue = address || {
    street: '',
    number: '',
    complement: '',
    zipcode: '',
    countryId: '',
    stateId: '',
    cityId: '',
  };

  const handleChange = (v: Parameters<typeof setValue<'address'>>[1]) => {
    setValue('address', {
      street: v.street,
      number: v.number ?? '',
      complement: v.complement ?? '',
      zipcode: v.zipcode ?? '',
      countryId: v.countryId,
      stateId: v.stateId,
      cityId: v.cityId,
    });
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
          value={addressValue}
          onChange={handleChange}
          disabled={disabled || isViewOnly}
          showLabelAndDefault={false}
          required={!isViewOnly}
          errors={{
            street: errors.address?.street?.message,
            number: errors.address?.number?.message,
            complement: errors.address?.complement?.message,
            zipcode: errors.address?.zipcode?.message,
            countryId: errors.address?.countryId?.message,
            stateId: errors.address?.stateId?.message,
            cityId: errors.address?.cityId?.message,
          }}
        />
      </Card>
    </div>
  );
};
