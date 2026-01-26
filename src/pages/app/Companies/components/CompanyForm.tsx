/**
 * CompanyForm Component
 * Reusable form for create, view, and edit company pages
 * Uses React Hook Form context
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, Label, Badge } from '@components';
import type { Company } from '@services/companies';
import type { CompanyFormData } from '../schemas';
import { AddressSelector } from './AddressSelector';

interface CompanyFormProps {
  isViewOnly?: boolean;
  company?: Company;
  mode: 'create' | 'view' | 'edit';
  onAddressChange?: (addressId: string) => void;
  onAddressDataChange?: (data: any) => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ 
  isViewOnly = false, 
  company, 
  mode,
  onAddressChange,
  onAddressDataChange
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CompanyFormData>();

  const addressId = watch('addressId');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <FormField
          label="Nome da Empresa"
          required={!isViewOnly}
          {...register('name')}
          error={!!errors.name}
          errorText={errors.name?.message}
          placeholder="Digite o nome da empresa"
          disabled={isViewOnly}
        />

        {/* CNPJ Field */}
        <FormField
          label="CNPJ"
          required={!isViewOnly}
          {...register('cnpj')}
          error={!!errors.cnpj}
          errorText={errors.cnpj?.message}
          placeholder="00.000.000/0000-00"
          disabled={isViewOnly}
        />

        {/* Phone Field */}
        <FormField
          label="Telefone"
          {...register('phone')}
          error={!!errors.phone}
          errorText={errors.phone?.message}
          placeholder="+5511999999999"
          disabled={isViewOnly}
        />

        {/* Status Field - Only in view mode */}
        {isViewOnly && company && (
          <div>
            <Label className="mb-2 block">Status</Label>
            <div className="mt-1">
              <Badge variant={company.isActive ? 'success' : 'error'}>
                {company.isActive ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Address Selector */}
      <AddressSelector
        mode={mode}
        addressId={addressId}
        onAddressChange={(id) => {
          setValue('addressId', id);
          onAddressChange?.(id);
        }}
        onAddressDataChange={onAddressDataChange}
        disabled={isViewOnly}
      />
    </div>
  );
};
