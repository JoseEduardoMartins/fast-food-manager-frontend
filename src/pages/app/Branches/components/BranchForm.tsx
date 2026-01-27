/**
 * BranchForm Component
 * Reusable form for create, view, and edit branch pages
 * Uses React Hook Form context
 */

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, Label, Badge, AsyncSelect } from '@components';
import type { Branch } from '@services/branches';
import type { BranchFormData } from '../schemas';
import { listCompanies, type Company } from '@services/companies';
import { listMenus, type Menu } from '@services/menus';
import type { ListCompaniesParams } from '@services/companies';
import type { ListMenusParams } from '@services/menus';
import { AddressSelector } from './AddressSelector';

interface BranchFormProps {
  isViewOnly?: boolean;
  branch?: Branch;
  mode: 'create' | 'view' | 'edit';
  onAddressDataChange?: (data: any) => void;
}

export const BranchForm: React.FC<BranchFormProps> = ({ 
  isViewOnly = false, 
  branch, 
  mode,
  onAddressDataChange,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BranchFormData>();

  const companyId = watch('companyId');
  const menuId = watch('menuId');

  // Load functions for AsyncSelect
  const loadCompanies = async (params?: ListCompaniesParams): Promise<Company[]> => {
    try {
      const response = await listCompanies({
        pageSize: 200,
        sort: {
          fields: ['name'],
          order: ['ASC'],
        },
        ...params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      return [];
    }
  };

  const loadMenus = async (params?: ListMenusParams): Promise<Menu[]> => {
    try {
      const response = await listMenus({
        pageSize: 200,
        sort: {
          fields: ['name'],
          order: ['ASC'],
        },
        ...params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar menus:', error);
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <FormField
          label="Nome da Filial"
          required={!isViewOnly}
          {...register('name')}
          error={!!errors.name}
          errorText={errors.name?.message}
          placeholder="Digite o nome da filial"
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

        {/* Company Select - Full width */}
        <div className="md:col-span-2">
          <AsyncSelect<Company, ListCompaniesParams>
            label="Empresa"
            value={companyId || branch?.companyId || ''}
            onChange={(e) => setValue('companyId', e.target.value)}
            loadOptions={loadCompanies}
            getValue={(company) => company.id}
            getLabel={(company) => company.name}
            placeholder="Selecione uma empresa"
            loadingText="Carregando empresas..."
            noOptionsText="Nenhuma empresa disponível"
            errorText="Erro ao carregar empresas"
            disabled={isViewOnly}
            reloadOnParamsChange={false}
          />
          {errors.companyId && (
            <p className="text-sm text-error mt-1">{errors.companyId.message}</p>
          )}
        </div>

        {/* Menu Select - Full width */}
        <div className="md:col-span-2">
          <AsyncSelect<Menu, ListMenusParams>
            label="Menu"
            value={menuId || branch?.menuId || ''}
            onChange={(e) => setValue('menuId', e.target.value)}
            loadOptions={loadMenus}
            getValue={(menu) => menu.id}
            getLabel={(menu) => menu.name}
            placeholder="Selecione um menu"
            loadingText="Carregando menus..."
            noOptionsText="Nenhum menu disponível"
            errorText="Erro ao carregar menus"
            disabled={isViewOnly}
            reloadOnParamsChange={false}
          />
          {errors.menuId && (
            <p className="text-sm text-error mt-1">{errors.menuId.message}</p>
          )}
        </div>

        {/* Status Field - Only in view mode */}
        {isViewOnly && branch && (
          <div>
            <Label className="mb-2 block">Status</Label>
            <div className="mt-1">
              <Badge variant={branch.isActive ? 'success' : 'error'}>
                {branch.isActive ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Address Selector */}
      <AddressSelector
        mode={mode}
        disabled={isViewOnly}
        onAddressDataChange={onAddressDataChange}
      />
    </div>
  );
};
