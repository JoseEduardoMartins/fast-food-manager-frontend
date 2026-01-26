/**
 * AddressSelector Component
 * Manages a single address for companies (companies have only one required address)
 */

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Card, Icon, FormField, Label, AsyncSelect } from '@components';
import { listCountries, type Country } from '@services/countries';
import { listStates, type State } from '@services/states';
import { listCities, type City } from '@services/cities';
import type { ListCountriesParams } from '@services/countries';
import type { ListStatesParams } from '@services/states';
import type { ListCitiesParams } from '@services/cities';
import type { AddressSelectorProps, AddressData } from './AddressSelector.type';

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  mode,
  onAddressChange,
  onAddressDataChange,
  disabled = false,
}) => {
  const [address, setAddress] = useState<AddressData>({
    street: '',
    number: '',
    complement: '',
    zipcode: '',
    countryId: '',
    stateId: '',
    cityId: '',
  });

  const isViewOnly = mode === 'view';

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

  const handleAddressChange = (field: keyof AddressData, value: string) => {
    const newAddress = { ...address, [field]: value };
    
    // Reset dependent fields
    if (field === 'countryId') {
      newAddress.stateId = '';
      newAddress.cityId = '';
    } else if (field === 'stateId') {
      newAddress.cityId = '';
    }
    
    setAddress(newAddress);
    
    // Notify parent of address data changes
    onAddressDataChange?.(newAddress);
    
    // Generate a temporary ID for the address (will be replaced when address is created)
    // For now, we'll use a combination of fields as a temporary identifier
    if (newAddress.street && newAddress.countryId && newAddress.stateId && newAddress.cityId) {
      const tempId = `temp-${Date.now()}`;
      onAddressChange(tempId);
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
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="Nome da rua"
              disabled={disabled || isViewOnly}
            />
            <FormField
              label="Número"
              value={address.number}
              onChange={(e) => handleAddressChange('number', e.target.value)}
              placeholder="123"
              disabled={disabled || isViewOnly}
            />
            <FormField
              label="Complemento"
              value={address.complement}
              onChange={(e) => handleAddressChange('complement', e.target.value)}
              placeholder="Apto, Bloco, etc"
              disabled={disabled || isViewOnly}
            />
            <FormField
              label="CEP"
              value={address.zipcode}
              onChange={(e) => handleAddressChange('zipcode', e.target.value)}
              placeholder="00000-000"
              disabled={disabled || isViewOnly}
            />
          </div>

          {/* Country, State, City selects */}
          <AsyncSelect<Country, ListCountriesParams>
            label="País"
            value={address.countryId}
            onChange={(e) => handleAddressChange('countryId', e.target.value)}
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
            onChange={(e) => handleAddressChange('stateId', e.target.value)}
            loadOptions={loadStates}
            loadParams={address.countryId ? {} : undefined}
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
            onChange={(e) => handleAddressChange('cityId', e.target.value)}
            loadOptions={loadCities}
            loadParams={address.stateId ? {} : undefined}
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
