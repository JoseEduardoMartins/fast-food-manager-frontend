/**
 * AddressSelector Component for Branches
 * Manages a single address for branches
 * Creates address inline and stores addressId in form
 */

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { Card, Icon, FormField, Label, AsyncSelect } from '@components';
import { listCountries, type Country } from '@services/countries';
import { listStates, type State } from '@services/states';
import { listCities, type City } from '@services/cities';
import { getAddressById } from '@services/addresses';
import type { ListCountriesParams } from '@services/countries';
import type { ListStatesParams } from '@services/states';
import type { ListCitiesParams } from '@services/cities';
import type { AddressSelectorProps } from './AddressSelector.type';
import type { BranchFormData } from '../schemas';

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  mode,
  disabled = false,
  onAddressDataChange,
}) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BranchFormData>();

  const addressId = watch('addressId');
  const isViewOnly = mode === 'view';
  
  // Local state for address data (for create/edit)
  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    zipcode: '',
    countryId: '',
    stateId: '',
    cityId: '',
  });

  // Load address data when viewing/editing
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

  // Load functions for AsyncSelect
  const loadCountries = async (params?: ListCountriesParams): Promise<Country[]> => {
    try {
      const response = await listCountries({
        pageSize: 200,
        sort: {
          fields: ['name'],
          order: ['ASC'],
        },
        ...params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar países:', error);
      return [];
    }
  };

  const loadStates = async (params?: ListStatesParams): Promise<State[]> => {
    if (!address.countryId) {
      return [];
    }

    try {
      const response = await listStates({
        countryId: address.countryId,
        pageSize: 200,
        sort: {
          fields: ['name'],
          order: ['ASC'],
        },
        ...params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar estados:', error);
      return [];
    }
  };

  const loadCities = async (params?: ListCitiesParams): Promise<City[]> => {
    if (!address.stateId) {
      return [];
    }

    try {
      const response = await listCities({
        stateId: address.stateId,
        pageSize: 500,
        sort: {
          fields: ['name'],
          order: ['ASC'],
        },
        ...params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
      return [];
    }
  };

  const handleFieldChange = (field: keyof typeof address, value: string) => {
    const newAddress = { ...address, [field]: value };
    
    // Reset dependent fields
    if (field === 'countryId') {
      newAddress.stateId = '';
      newAddress.cityId = '';
    } else if (field === 'stateId') {
      newAddress.cityId = '';
    }
    
    setAddress(newAddress);
    
    // Generate temporary addressId for new addresses
    if (newAddress.street && newAddress.countryId && newAddress.stateId && newAddress.cityId) {
      const tempId = `temp-${Date.now()}`;
      setValue('addressId', tempId);
      // Notify parent of address data change
      onAddressDataChange?.(newAddress);
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Rua"
              required={!isViewOnly}
              value={address.street}
              onChange={(e) => handleFieldChange('street', e.target.value)}
              placeholder="Nome da rua"
              disabled={disabled || isViewOnly}
            />
            <FormField
              label="Número"
              value={address.number}
              onChange={(e) => handleFieldChange('number', e.target.value)}
              placeholder="123"
              disabled={disabled || isViewOnly}
            />
            <FormField
              label="Complemento"
              value={address.complement}
              onChange={(e) => handleFieldChange('complement', e.target.value)}
              placeholder="Apto, Bloco, etc"
              disabled={disabled || isViewOnly}
            />
            <FormField
              label="CEP"
              value={address.zipcode}
              onChange={(e) => handleFieldChange('zipcode', e.target.value)}
              placeholder="00000-000"
              disabled={disabled || isViewOnly}
            />
          </div>

          {/* Country, State, City selects */}
          <AsyncSelect<Country, ListCountriesParams>
            label="País"
            value={address.countryId}
            onChange={(e) => handleFieldChange('countryId', e.target.value)}
            loadOptions={loadCountries}
            getValue={(country) => country.id}
            getLabel={(country) => `${country.name} (${country.shortName}) - ${country.phoneCode}`}
            placeholder="Selecione um país"
            loadingText="Carregando países..."
            noOptionsText="Nenhum país disponível"
            errorText="Erro ao carregar países"
            disabled={disabled || isViewOnly}
            reloadOnParamsChange={false}
          />

          <AsyncSelect<State, ListStatesParams>
            label="Estado"
            value={address.stateId}
            onChange={(e) => handleFieldChange('stateId', e.target.value)}
            loadOptions={loadStates}
            loadParams={address.countryId ? { countryId: address.countryId } : undefined}
            getValue={(state) => state.id}
            getLabel={(state) => `${state.name} (${state.shortName})`}
            placeholder={!address.countryId ? 'Selecione um país primeiro' : 'Selecione um estado'}
            loadingText="Carregando estados..."
            noOptionsText="Nenhum estado disponível"
            errorText="Erro ao carregar estados"
            disabled={!address.countryId || disabled || isViewOnly}
            reloadOnParamsChange={true}
          />

          <AsyncSelect<City, ListCitiesParams>
            label="Cidade"
            value={address.cityId}
            onChange={(e) => handleFieldChange('cityId', e.target.value)}
            loadOptions={loadCities}
            loadParams={address.stateId ? { stateId: address.stateId } : undefined}
            getValue={(city) => city.id}
            getLabel={(city) => city.name}
            placeholder={!address.stateId ? 'Selecione um estado primeiro' : 'Selecione uma cidade'}
            loadingText="Carregando cidades..."
            noOptionsText="Nenhuma cidade disponível"
            errorText="Erro ao carregar cidades"
            disabled={!address.stateId || disabled || isViewOnly}
            reloadOnParamsChange={true}
          />
        </div>
      </Card>
    </div>
  );
};
