/**
 * AddressFormFields - Componente unificado de campos de endereço
 *
 * Características:
 * - País selecionado → filtra estados
 * - Estado selecionado → filtra cidades
 * - Ao mudar país → limpa stateId e cityId
 * - Ao mudar estado → limpa cityId
 */

import React, { useId } from 'react';
import { FormField, Label, AsyncSelect } from '@components';
import { useAddressLocation } from '@common/hooks';
import type { Country } from '@services/countries';
import type { State } from '@services/states';
import type { City } from '@services/cities';
import type { ListCountriesParams } from '@services/countries';
import type { ListStatesParams } from '@services/states';
import type { ListCitiesParams } from '@services/cities';
import type { AddressFormFieldsProps } from './AddressFormFields.type';

export const AddressFormFields: React.FC<AddressFormFieldsProps> = ({
  value,
  onChange,
  disabled = false,
  showLabelAndDefault = false,
  required = false,
  errors = {},
}) => {
  const { loadCountries, loadStates, loadCities } = useAddressLocation();
  const defaultCheckboxId = useId();

  const updateField = <K extends keyof AddressFormFieldsProps['value']>(
    field: K,
    fieldValue: AddressFormFieldsProps['value'][K]
  ) => {
    const next = { ...value, [field]: fieldValue };

    // Cascata: ao mudar país
    if (field === 'countryId') {
      next.stateId = '';
      next.cityId = '';
    }
    // Cascata: ao mudar estado
    else if (field === 'stateId') {
      next.cityId = '';
    }

    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Rua"
          required={required}
          value={value.street}
          onChange={(e) => updateField('street', e.target.value)}
          placeholder="Nome da rua"
          disabled={disabled}
          error={!!errors.street}
          errorText={errors.street}
        />
        <FormField
          label="Número"
          value={value.number ?? ''}
          onChange={(e) => updateField('number', e.target.value)}
          placeholder="123"
          disabled={disabled}
          error={!!errors.number}
          errorText={errors.number}
        />
        <FormField
          label="Complemento"
          value={value.complement ?? ''}
          onChange={(e) => updateField('complement', e.target.value)}
          placeholder="Apto, Bloco, etc"
          disabled={disabled}
          error={!!errors.complement}
          errorText={errors.complement}
        />
        <FormField
          label="CEP"
          value={value.zipcode ?? ''}
          onChange={(e) => updateField('zipcode', e.target.value)}
          placeholder="00000-000"
          disabled={disabled}
          error={!!errors.zipcode}
          errorText={errors.zipcode}
        />

        {/* País */}
        <AsyncSelect<Country, ListCountriesParams>
          label="País"
          value={value.countryId}
          onChange={(e) => updateField('countryId', e.target.value)}
          loadOptions={loadCountries}
          getValue={(country) => country.id}
          getLabel={(country) => `${country.name} (${country.shortName}) - ${country.phoneCode}`}
          placeholder="Selecione um país"
          loadingText="Carregando países..."
          noOptionsText="Nenhum país disponível"
          errorText="Erro ao carregar países"
          disabled={disabled}
          reloadOnParamsChange={false}
        />
        {errors.countryId && (
          <p className="text-sm text-error mt-1">{errors.countryId}</p>
        )}

        {/* Estado - filtrado por país */}
        <AsyncSelect<State, ListStatesParams>
          label="Estado"
          value={value.stateId}
          onChange={(e) => updateField('stateId', e.target.value)}
          loadOptions={loadStates}
          loadParams={value.countryId ? { countryId: value.countryId } : undefined}
          getValue={(state) => state.id}
          getLabel={(state) => `${state.name} (${state.shortName})`}
          placeholder={!value.countryId ? 'Selecione um país primeiro' : 'Selecione um estado'}
          loadingText="Carregando estados..."
          noOptionsText="Nenhum estado disponível"
          errorText="Erro ao carregar estados"
          disabled={!value.countryId || disabled}
          reloadOnParamsChange={true}
        />
        {errors.stateId && (
          <p className="text-sm text-error mt-1">{errors.stateId}</p>
        )}

        {/* Cidade - filtrada por estado */}
        <AsyncSelect<City, ListCitiesParams>
          label="Cidade"
          value={value.cityId}
          onChange={(e) => updateField('cityId', e.target.value)}
          loadOptions={loadCities}
          loadParams={value.stateId ? { stateId: value.stateId } : undefined}
          getValue={(city) => city.id}
          getLabel={(city) => city.name}
          placeholder={!value.stateId ? 'Selecione um estado primeiro' : 'Selecione uma cidade'}
          loadingText="Carregando cidades..."
          noOptionsText="Nenhuma cidade disponível"
          errorText="Erro ao carregar cidades"
          disabled={!value.stateId || disabled}
          reloadOnParamsChange={true}
        />
        {errors.cityId && (
          <p className="text-sm text-error mt-1">{errors.cityId}</p>
        )}

        {showLabelAndDefault && (
          <>
            <FormField
              label="Rótulo"
              value={value.label ?? ''}
              onChange={(e) => updateField('label', e.target.value)}
              placeholder="Casa, Trabalho, etc"
              disabled={disabled}
              error={!!errors.label}
              errorText={errors.label}
            />
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id={defaultCheckboxId}
                checked={value.isDefault ?? false}
                onChange={(e) => updateField('isDefault', e.target.checked)}
                disabled={disabled}
                className="h-4 w-4"
              />
              <Label htmlFor={defaultCheckboxId}>Endereço padrão</Label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
