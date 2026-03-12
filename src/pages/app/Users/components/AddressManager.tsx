/**
 * AddressManager Component
 * Manages user addresses for create, view, and edit modes
 */

import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Button, Icon, Badge, FormField, Label, AsyncSelect } from '@components';
import { removeUserAddress, updateUserAddress } from '@services/users';
import type { UserAddressInput, UserAddress } from '@services/users';
import type { AddressManagerProps } from './AddressManager.type';
import { listCountries, type Country } from '@services/countries';
import { listStates, type State } from '@services/states';
import { listCities, type City } from '@services/cities';
import type { ListCountriesParams } from '@services/countries';
import type { ListStatesParams } from '@services/states';
import type { ListCitiesParams } from '@services/cities';

export const AddressManager: React.FC<AddressManagerProps> = ({
  addresses = [],
  mode,
  userId,
  onAddressChange,
  onAddressesChange,
}) => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [localAddresses, setLocalAddresses] = useState<UserAddressInput[]>([]);
  const [newAddress, setNewAddress] = useState<UserAddressInput>({
    street: '',
    number: '',
    complement: '',
    zipcode: '',
    countryId: '',
    stateId: '',
    cityId: '',
    label: '',
    isDefault: false,
  });

  const isViewOnly = mode === 'view';
  const canManageAddresses = mode === 'create' || mode === 'edit';
  const isCreateMode = mode === 'create';
  const isEditControlled = mode === 'edit' && onAddressesChange != null;
  const controlledList = isEditControlled ? (addresses as UserAddressInput[]) : [];

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
      toast.error('Erro ao carregar países');
      return [];
    }
  };

  const loadStates = async (params?: ListStatesParams): Promise<State[]> => {
    if (!newAddress.countryId) {
      return [];
    }

    try {
      const response = await listStates({
        countryId: newAddress.countryId,
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
      toast.error('Erro ao carregar estados');
      return [];
    }
  };

  const loadCities = async (params?: ListCitiesParams): Promise<City[]> => {
    if (!newAddress.stateId) {
      return [];
    }

    try {
      const response = await listCities({
        stateId: newAddress.stateId,
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
      toast.error('Erro ao carregar cidades');
      return [];
    }
  };

  const handleAddAddress = async () => {
    // Validações
    if (!newAddress.street.trim()) {
      toast.error('Rua é obrigatória');
      return;
    }
    if (!newAddress.countryId) {
      toast.error('País é obrigatório');
      return;
    }
    if (!newAddress.stateId) {
      toast.error('Estado é obrigatório');
      return;
    }
    if (!newAddress.cityId) {
      toast.error('Cidade é obrigatória');
      return;
    }

    // Buscar dados completos das entidades selecionadas
    let selectedCountry: Country | undefined;
    let selectedState: State | undefined;
    let selectedCity: City | undefined;

    try {
      if (newAddress.countryId) {
        const countriesData = await loadCountries();
        selectedCountry = countriesData.find(c => c.id === newAddress.countryId);
      }
      if (newAddress.stateId) {
        const statesData = await loadStates();
        selectedState = statesData.find(s => s.id === newAddress.stateId);
      }
      if (newAddress.cityId) {
        const citiesData = await loadCities();
        selectedCity = citiesData.find(c => c.id === newAddress.cityId);
      }
    } catch (error) {
      console.error('Erro ao buscar dados completos:', error);
    }

    // Criar endereço com dados completos para exibição
    const addressWithDetails: UserAddressInput = {
      ...newAddress,
      country: selectedCountry ? {
        id: selectedCountry.id,
        name: selectedCountry.name,
        shortName: selectedCountry.shortName,
        phoneCode: selectedCountry.phoneCode,
      } : undefined,
      state: selectedState ? {
        id: selectedState.id,
        name: selectedState.name,
        shortName: selectedState.shortName,
      } : undefined,
      city: selectedCity ? {
        id: selectedCity.id,
        name: selectedCity.name,
      } : undefined,
    };

    let updatedAddresses: UserAddressInput[];

    if (isEditControlled) {
      const baseList = controlledList;
      if (editingAddressIndex !== null) {
        updatedAddresses = baseList.map((addr, idx) =>
          idx === editingAddressIndex ? addressWithDetails : addr
        );
        toast.success('Endereço atualizado');
        setEditingAddressIndex(null);
      } else {
        updatedAddresses = [...baseList, addressWithDetails];
        toast.success('Endereço adicionado');
      }
    } else {
      if (editingAddressIndex !== null) {
        updatedAddresses = localAddresses.map((addr, idx) =>
          idx === editingAddressIndex ? addressWithDetails : addr
        );
        toast.success('Endereço atualizado');
        setEditingAddressIndex(null);
      } else {
        updatedAddresses = [...localAddresses, addressWithDetails];
        toast.success('Endereço adicionado');
      }
    }

    if (addressWithDetails.isDefault) {
      const hasDefaultAddress = updatedAddresses.some((addr, idx) => {
        if (editingAddressIndex !== null) {
          return addr.isDefault && idx !== editingAddressIndex;
        } else {
          return addr.isDefault && idx !== updatedAddresses.length - 1;
        }
      });

      if (hasDefaultAddress) {
        toast.info('O endereço padrão anterior foi desmarcado');
      }

      updatedAddresses = updatedAddresses.map((addr, idx) => {
        if (editingAddressIndex !== null) {
          return idx === editingAddressIndex ? addr : { ...addr, isDefault: false };
        } else {
          return idx === updatedAddresses.length - 1 ? addr : { ...addr, isDefault: false };
        }
      });
    }

    if (isEditControlled) {
      onAddressesChange(updatedAddresses);
    } else {
      setLocalAddresses(updatedAddresses);
      onAddressesChange?.(updatedAddresses);
    }

    setIsAddingAddress(false);
    setNewAddress({
      street: '',
      number: '',
      complement: '',
      zipcode: '',
      countryId: '',
      stateId: '',
      cityId: '',
      label: '',
      isDefault: false,
    });
  };

  const handleEditAddress = (index: number) => {
    const sourceList = isEditControlled ? controlledList : localAddresses;
    const addressToEdit = sourceList[index];
    if (!addressToEdit) return;

    setNewAddress({
      street: addressToEdit.street,
      number: addressToEdit.number || '',
      complement: addressToEdit.complement || '',
      zipcode: addressToEdit.zipcode || '',
      countryId: addressToEdit.countryId,
      stateId: addressToEdit.stateId,
      cityId: addressToEdit.cityId,
      label: addressToEdit.label || '',
      isDefault: addressToEdit.isDefault || false,
    });

    setEditingAddressIndex(index);
    setIsAddingAddress(true);
  };

  const handleCancelEdit = () => {
    setIsAddingAddress(false);
    setEditingAddressIndex(null);
    setNewAddress({
      street: '',
      number: '',
      complement: '',
      zipcode: '',
      countryId: '',
      stateId: '',
      cityId: '',
      label: '',
      isDefault: false,
    });
  };

  const handleUpdateAddress = async (addressId: string, label: string, isDefault: boolean) => {
    if (!userId) return;

    try {
      await updateUserAddress(userId, addressId, { label, isDefault });
      toast.success('Endereço atualizado com sucesso');
      setEditingAddressId(null);
      onAddressChange?.();
    } catch (error) {
      toast.error('Erro ao atualizar endereço');
      console.error('Error updating address:', error);
    }
  };

  const handleRemoveAddress = async (index: number, userAddressId?: string) => {
    if (!window.confirm('Tem certeza que deseja remover este endereço?')) {
      return;
    }

    if (isCreateMode) {
      const updatedAddresses = localAddresses.filter((_, i) => i !== index);
      setLocalAddresses(updatedAddresses);
      onAddressesChange?.(updatedAddresses);
      toast.success('Endereço removido');
    } else if (isEditControlled) {
      const updatedAddresses = controlledList.filter((_, i) => i !== index);
      onAddressesChange(updatedAddresses);
      toast.success('Endereço removido');
    } else if (userId && userAddressId) {
      try {
        await removeUserAddress(userId, userAddressId);
        toast.success('Endereço removido com sucesso');
        onAddressChange?.();
      } catch (error) {
        toast.error('Erro ao remover endereço');
        console.error('Error removing address:', error);
      }
    }
  };

  const formatAddress = (address: UserAddress['address'] | undefined) => {
    if (!address) return { line1: '', line2: '', zipcode: '' };
    
    const parts = [
      address.street,
      address.number,
      address.complement,
    ].filter(Boolean);

    const location = [
      address.city?.name,
      address.state?.shortName,
    ].filter(Boolean).join(' - ');

    return {
      line1: parts.join(', '),
      line2: location,
      zipcode: address.zipcode,
    };
  };

  // Helper functions to format address location display
  const formatAddressLocation = (addr: UserAddressInput) => {
    const cityName = addr.city?.name || addr.cityId;
    const stateName = addr.state ? `${addr.state.name} (${addr.state.shortName})` : addr.stateId;
    const countryName = addr.country ? `${addr.country.name} (${addr.country.shortName})` : addr.countryId;

    return {
      cityState: `${cityName} - ${stateName}`,
      country: countryName,
    };
  };

  // Determine which addresses to display
  const displayAddresses = isCreateMode
    ? localAddresses.map((addr, index) => ({
        ...addr,
        tempId: `temp-${index}`,
      }))
    : isEditControlled
      ? controlledList
      : addresses;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold flex items-center gap-2">
          <Icon icon={MapPin} size={20} />
          Endereços
        </Label>
        {canManageAddresses && !isAddingAddress && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAddingAddress(true)}
          >
            <Icon icon={Plus} size={16} className="mr-2" />
            Adicionar Endereço
          </Button>
        )}
      </div>

      {/* Add/Edit Address Form */}
      {isAddingAddress && canManageAddresses && (
        <Card className="p-4 border-2 border-dashed">
          <h3 className="text-lg font-semibold mb-4">
            {editingAddressIndex !== null ? 'Editar Endereço' : 'Adicionar Endereço'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Rua"
                required
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                placeholder="Nome da rua"
              />
              <FormField
                label="Número"
                value={newAddress.number}
                onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                placeholder="123"
              />
              <FormField
                label="Complemento"
                value={newAddress.complement}
                onChange={(e) => setNewAddress({ ...newAddress, complement: e.target.value })}
                placeholder="Apto, Bloco, etc"
              />
              <FormField
                label="CEP"
                value={newAddress.zipcode}
                onChange={(e) => setNewAddress({ ...newAddress, zipcode: e.target.value })}
                placeholder="00000-000"
              />
              
              {/* Country select - using AsyncSelect */}
              <AsyncSelect<Country, ListCountriesParams>
                label="País"
                value={newAddress.countryId}
                onChange={(e) => {
                  setNewAddress({ 
                    ...newAddress, 
                    countryId: e.target.value,
                    stateId: '', // Reset state when country changes
                    cityId: '', // Reset city when country changes
                  });
                }}
                loadOptions={loadCountries}
                getValue={(country) => country.id}
                getLabel={(country) => `${country.name} (${country.shortName}) - ${country.phoneCode}`}
                placeholder="Selecione um país"
                loadingText="Carregando países..."
                noOptionsText="Nenhum país disponível"
                errorText="Erro ao carregar países"
                reloadOnParamsChange={false}
              />
              
              {/* State select - using AsyncSelect (cascading from country) */}
              <AsyncSelect<State, ListStatesParams>
                label="Estado"
                value={newAddress.stateId}
                onChange={(e) => {
                  setNewAddress({ 
                    ...newAddress, 
                    stateId: e.target.value,
                    cityId: '', // Reset city when state changes
                  });
                }}
                loadOptions={loadStates}
                loadParams={newAddress.countryId ? {} : undefined}
                getValue={(state) => state.id}
                getLabel={(state) => `${state.name} (${state.shortName})`}
                placeholder={!newAddress.countryId ? 'Selecione um país primeiro' : 'Selecione um estado'}
                loadingText="Carregando estados..."
                noOptionsText="Nenhum estado disponível"
                errorText="Erro ao carregar estados"
                disabled={!newAddress.countryId}
                reloadOnParamsChange={true}
              />
              
              {/* City select - using AsyncSelect (cascading from state) */}
              <AsyncSelect<City, ListCitiesParams>
                label="Cidade"
                value={newAddress.cityId}
                onChange={(e) => setNewAddress({ ...newAddress, cityId: e.target.value })}
                loadOptions={loadCities}
                loadParams={newAddress.stateId ? {} : undefined}
                getValue={(city) => city.id}
                getLabel={(city) => city.name}
                placeholder={!newAddress.stateId ? 'Selecione um estado primeiro' : 'Selecione uma cidade'}
                loadingText="Carregando cidades..."
                noOptionsText="Nenhuma cidade disponível"
                errorText="Erro ao carregar cidades"
                disabled={!newAddress.stateId}
                reloadOnParamsChange={true}
              />
              
              <FormField
                label="Rótulo"
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                placeholder="Casa, Trabalho, etc"
              />
              
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="newAddressDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="newAddressDefault">Endereço padrão</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={handleAddAddress}>
                <Icon icon={Check} size={16} className="mr-2" />
                {editingAddressIndex !== null ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
              >
                <Icon icon={X} size={16} className="mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Address List */}
      {displayAddresses.length === 0 ? (
        <Card className="p-8 text-center">
          <Icon icon={MapPin} size={48} className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500">Nenhum endereço cadastrado</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {isCreateMode || isEditControlled ? (
            (isCreateMode ? localAddresses : controlledList).map((addr, index) => {
              const location = formatAddressLocation(addr);
              return (
                <Card key={isCreateMode ? `temp-${index}` : `edit-${index}-${addr.id ?? index}`} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {addr.label && (
                          <Badge variant="secondary">{addr.label}</Badge>
                        )}
                        {addr.isDefault && (
                          <Badge variant="success">Padrão</Badge>
                        )}
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="font-medium">
                          {addr.street}{addr.number ? `, ${addr.number}` : ''}
                        </p>
                        {addr.complement && (
                          <p className="text-gray-600">{addr.complement}</p>
                        )}
                        {addr.zipcode && (
                          <p className="text-gray-500">CEP: {addr.zipcode}</p>
                        )}
                        <p className="text-gray-600 text-sm">
                          {location.cityState}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {location.country}
                        </p>
                      </div>
                    </div>
                    {!isViewOnly && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAddress(index)}
                          title="Editar endereço"
                          disabled={isAddingAddress}
                        >
                          <Icon icon={Edit} size={16} />
                        </Button>
                        <Button
                          type="button"
                          variant="error"
                          size="sm"
                          onClick={() => handleRemoveAddress(index)}
                          title="Remover endereço"
                        >
                          <Icon icon={Trash2} size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            (addresses as UserAddress[]).map((userAddress, index) => {
              const formatted = formatAddress(userAddress.address);
              const isEditing = editingAddressId === userAddress.id;

              return (
                <Card key={userAddress.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {userAddress.label && (
                          <Badge variant="secondary">{userAddress.label}</Badge>
                        )}
                        {userAddress.isDefault && (
                          <Badge variant="success">Padrão</Badge>
                        )}
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="font-medium">{formatted.line1}</p>
                        <p className="text-gray-600">{formatted.line2}</p>
                        {formatted.zipcode && (
                          <p className="text-gray-500">CEP: {formatted.zipcode}</p>
                        )}
                      </div>
                    </div>
                    {!isViewOnly && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAddressId(isEditing ? null : (userAddress.id ?? null))}
                          title="Editar endereço"
                        >
                          <Icon icon={Edit} size={16} />
                        </Button>
                        <Button
                          type="button"
                          variant="error"
                          size="sm"
                          onClick={() => handleRemoveAddress(index, userAddress.id)}
                          title="Remover endereço"
                        >
                          <Icon icon={Trash2} size={16} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Edit Mode */}
                  {isEditing && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <FormField
                        label="Rótulo"
                        defaultValue={userAddress.label || ''}
                        placeholder="Casa, Trabalho, etc"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`address-default-${userAddress.id}`}
                          defaultChecked={userAddress.isDefault}
                          className="h-4 w-4"
                        />
                        <Label htmlFor={`address-default-${userAddress.id}`}>
                          Endereço padrão
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            const labelInput = document.querySelector(
                              `input[defaultValue="${userAddress.label || ''}"]`
                            ) as HTMLInputElement;
                            const isDefaultInput = document.getElementById(
                              `address-default-${userAddress.id}`
                            ) as HTMLInputElement;
                            handleUpdateAddress(
                              userAddress.id,
                              labelInput?.value || '',
                              isDefaultInput?.checked || false
                            );
                          }}
                        >
                          <Icon icon={Check} size={14} className="mr-1" />
                          Salvar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAddressId(null)}
                        >
                          <Icon icon={X} size={14} className="mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
