/**
 * useAddressLocation Hook
 * Carrega países, estados e cidades com filtros em cascata
 *
 * Regras de cascata:
 * - País selecionado → filtra estados (loadStates recebe countryId)
 * - Estado selecionado → filtra cidades (loadCities recebe stateId)
 * - Ao mudar país → limpar stateId e cityId (tratado no componente)
 * - Ao mudar estado → limpar cityId (tratado no componente)
 */

import { useCallback } from 'react';
import { listCountries, type Country } from '@services/countries';
import { listStates, type State } from '@services/states';
import { listCities, type City } from '@services/cities';
import type { ListCountriesParams } from '@services/countries';
import type { ListStatesParams } from '@services/states';
import type { ListCitiesParams } from '@services/cities';

const DEFAULT_SORT = {
  fields: ['name'] as string[],
  order: ['ASC'] as ('ASC' | 'DESC')[],
};

export const useAddressLocation = () => {
  const loadCountries = useCallback(async (params?: ListCountriesParams): Promise<Country[]> => {
    try {
      const response = await listCountries({
        pageSize: 200,
        sort: DEFAULT_SORT,
        ...params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar países:', error);
      return [];
    }
  }, []);

  const loadStates = useCallback(
    async (params?: ListStatesParams): Promise<State[]> => {
      const countryId = params?.countryId;
      if (!countryId) return [];

      try {
        const response = await listStates({
          countryId,
          pageSize: 200,
          sort: DEFAULT_SORT,
          ...params,
        });
        return response.data;
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
        return [];
      }
    },
    []
  );

  const loadCities = useCallback(
    async (params?: ListCitiesParams): Promise<City[]> => {
      const stateId = params?.stateId;
      if (!stateId) return [];

      try {
        const response = await listCities({
          stateId,
          pageSize: 500,
          sort: DEFAULT_SORT,
          ...params,
        });
        return response.data;
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        return [];
      }
    },
    []
  );

  return {
    loadCountries,
    loadStates,
    loadCities,
  };
};
