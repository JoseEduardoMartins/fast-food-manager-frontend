/**
 * AddressSelector Component
 * Manages a single address for companies (companies have only one required address)
 * Uses React Hook Form context to manage address fields
 */

import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { Card, Icon, FormField, Label, AsyncSelect } from '@components';
import { listCountries, type Country } from '@services/countries';
import { listStates, type State } from '@services/states';
import { listCities, type City } from '@services/cities';
import type { ListCountriesParams } from '@services/countries';
import type { ListStatesParams } from '@services/states';
import type { ListCitiesParams } from '@services/cities';
import type { AddressSelectorProps } from './AddressSelector.type';
import type { CompanyFormData } from '../schemas';

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  mode,
  disabled = false,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CompanyFormData>();

  const address = watch('address');
  const isViewOnly = mode === 'view';
  
  // Track loaded data to ensure selects are populated in view mode
  const [countriesLoaded, setCountriesLoaded] = useState(false);
  const [statesLoaded, setStatesLoaded] = useState(false);
  const [citiesLoaded, setCitiesLoaded] = useState(false);

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
    if (!address?.countryId) {
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
    if (!address?.stateId) {
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
    const currentAddress = address || {
      street: '',
      number: '',
      complement: '',
      zipcode: '',
      countryId: '',
      stateId: '',
      cityId: '',
    };

    const newAddress = { ...currentAddress, [field]: value };
    
    // Reset dependent fields
    if (field === 'countryId') {
      newAddress.stateId = '';
      newAddress.cityId = '';
      setStatesLoaded(false);
      setCitiesLoaded(false);
    } else if (field === 'stateId') {
      newAddress.cityId = '';
      setCitiesLoaded(false);
    }
    
    setValue('address', newAddress);
  };

  // In view mode, ensure data is loaded when address is populated
  useEffect(() => {
    if (isViewOnly && address) {
      if (address.countryId && !countriesLoaded) {
        setCountriesLoaded(true);
      }
      if (address.countryId && address.stateId && !statesLoaded) {
        setStatesLoaded(true);
      }
      if (address.stateId && address.cityId && !citiesLoaded) {
        setCitiesLoaded(true);
      }
    }
  }, [isViewOnly, address, countriesLoaded, statesLoaded, citiesLoaded]);

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
              {...register('address.street')}
              error={!!errors.address?.street}
              errorText={errors.address?.street?.message}
              placeholder="Nome da rua"
              disabled={disabled || isViewOnly}
            />
            <FormField
              label="Número"
              {...register('address.number')}
              error={!!errors.address?.number}
              errorText={errors.address?.number?.message}
              placeholder="123"
              disabled={disabled || isViewOnly}
            />
            <FormField
              label="Complemento"
              {...register('address.complement')}
              error={!!errors.address?.complement}
              errorText={errors.address?.complement?.message}
              placeholder="Apto, Bloco, etc"
              disabled={disabled || isViewOnly}
            />
            <FormField
              label="CEP"
              {...register('address.zipcode')}
              error={!!errors.address?.zipcode}
              errorText={errors.address?.zipcode?.message}
              placeholder="00000-000"
              disabled={disabled || isViewOnly}
            />
          </div>

          {/* Country, State, City selects */}
          <AsyncSelect<Country, ListCountriesParams>
            label="País"
            value={address?.countryId || ''}
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
          {errors.address?.countryId && (
            <p className="text-sm text-error mt-1">{errors.address.countryId.message}</p>
          )}

          <AsyncSelect<State, ListStatesParams>
            label="Estado"
            value={address?.stateId || ''}
            onChange={(e) => handleFieldChange('stateId', e.target.value)}
            loadOptions={loadStates}
            loadParams={address?.countryId ? { countryId: address.countryId } : undefined}
            getValue={(state) => state.id}
            getLabel={(state) => `${state.name} (${state.shortName})`}
            placeholder={!address?.countryId ? 'Selecione um país primeiro' : 'Selecione um estado'}
            loadingText="Carregando estados..."
            noOptionsText="Nenhum estado disponível"
            errorText="Erro ao carregar estados"
            disabled={!address?.countryId || disabled || isViewOnly}
            reloadOnParamsChange={true}
          />
          {errors.address?.stateId && (
            <p className="text-sm text-error mt-1">{errors.address.stateId.message}</p>
          )}

          <AsyncSelect<City, ListCitiesParams>
            label="Cidade"
            value={address?.cityId || ''}
            onChange={(e) => handleFieldChange('cityId', e.target.value)}
            loadOptions={loadCities}
            loadParams={address?.stateId ? { stateId: address.stateId } : undefined}
            getValue={(city) => city.id}
            getLabel={(city) => city.name}
            placeholder={!address?.stateId ? 'Selecione um estado primeiro' : 'Selecione uma cidade'}
            loadingText="Carregando cidades..."
            noOptionsText="Nenhuma cidade disponível"
            errorText="Erro ao carregar cidades"
            disabled={!address?.stateId || disabled || isViewOnly}
            reloadOnParamsChange={true}
          />
          {errors.address?.cityId && (
            <p className="text-sm text-error mt-1">{errors.address.cityId.message}</p>
          )}
        </div>
      </Card>
    </div>
  );
};
