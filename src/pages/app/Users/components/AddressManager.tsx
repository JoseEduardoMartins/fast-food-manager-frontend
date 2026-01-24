/**
 * AddressManager Component
 * Manages user addresses for create, view, and edit modes
 */

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Button, Icon, Badge, FormField, Label } from '@components';
import { removeUserAddress, updateUserAddress } from '@services/users';
import type { UserAddressInput, UserAddress } from '@services/users';
import type { AddressManagerProps } from './AddressManager.type';
import { listCountries, type Country } from '@services/countries';
import { listStates, type State } from '@services/states';
import { listCities, type City } from '@services/cities';

export const AddressManager: React.FC<AddressManagerProps> = ({
  addresses = [],
  mode,
  userId,
  onAddressChange,
  onAddressesChange,
}) => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
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

  // Countries, states, cities data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const isViewOnly = mode === 'view';
  const canManageAddresses = mode === 'create' || mode === 'edit';
  const isCreateMode = mode === 'create';

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await listCountries({
          pageSize: 200, // Get all countries
          sort: {
            fields: ['name'],
            order: ['ASC'],
          },
        });
        setCountries(response.data);
      } catch (error) {
        console.error('Erro ao carregar países:', error);
        toast.error('Erro ao carregar países');
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    const loadStates = async () => {
      if (!newAddress.countryId) {
        setStates([]);
        return;
      }

      try {
        setLoadingStates(true);
        const response = await listStates({
          countryId: newAddress.countryId,
          pageSize: 200, // Get all states
          sort: {
            fields: ['name'],
            order: ['ASC'],
          },
        });
        setStates(response.data);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
        toast.error('Erro ao carregar estados');
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, [newAddress.countryId]);

  // Load cities when state changes
  useEffect(() => {
    const loadCities = async () => {
      if (!newAddress.stateId) {
        setCities([]);
        return;
      }

      try {
        setLoadingCities(true);
        const response = await listCities({
          stateId: newAddress.stateId,
          pageSize: 500, // Get all cities
          sort: {
            fields: ['name'],
            order: ['ASC'],
          },
        });
        setCities(response.data);
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        toast.error('Erro ao carregar cidades');
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [newAddress.stateId]);

  const handleAddAddress = () => {
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

    // Modo create ou edit: adiciona ao estado local
    const updatedAddresses = [...localAddresses, { ...newAddress }];
    setLocalAddresses(updatedAddresses);
    onAddressesChange?.(updatedAddresses);
    toast.success('Endereço adicionado');

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
      // Modo create: remove do estado local
      const updatedAddresses = localAddresses.filter((_, i) => i !== index);
      setLocalAddresses(updatedAddresses);
      onAddressesChange?.(updatedAddresses);
      toast.success('Endereço removido');
    } else if (userId && userAddressId) {
      // Modo edit: remove via API
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

  // Determine which addresses to display
  const displayAddresses = isCreateMode 
    ? localAddresses.map((addr, index) => ({
        ...addr,
        tempId: `temp-${index}`,
      }))
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

      {/* Add Address Form */}
      {isAddingAddress && canManageAddresses && (
        <Card className="p-4 border-2 border-dashed">
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
              
              {/* Country select - real data from API */}
              <div>
                <Label className="mb-2 block">País<span className="text-error ml-1">*</span></Label>
                <select
                  value={newAddress.countryId}
                  onChange={(e) => {
                    setNewAddress({ 
                      ...newAddress, 
                      countryId: e.target.value,
                      stateId: '', // Reset state when country changes
                      cityId: '', // Reset city when country changes
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={loadingCountries}
                >
                  <option value="">
                    {loadingCountries ? 'Carregando países...' : 'Selecione um país'}
                  </option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name} ({country.shortName}) - {country.phoneCode}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* State select - real data from API (cascading from country) */}
              <div>
                <Label className="mb-2 block">Estado<span className="text-error ml-1">*</span></Label>
                <select
                  value={newAddress.stateId}
                  onChange={(e) => {
                    setNewAddress({ 
                      ...newAddress, 
                      stateId: e.target.value,
                      cityId: '', // Reset city when state changes
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={!newAddress.countryId || loadingStates}
                >
                  <option value="">
                    {!newAddress.countryId 
                      ? 'Selecione um país primeiro' 
                      : loadingStates 
                        ? 'Carregando estados...' 
                        : 'Selecione um estado'}
                  </option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name} ({state.shortName})
                    </option>
                  ))}
                </select>
              </div>
              
              {/* City select - real data from API (cascading from state) */}
              <div>
                <Label className="mb-2 block">Cidade<span className="text-error ml-1">*</span></Label>
                <select
                  value={newAddress.cityId}
                  onChange={(e) => setNewAddress({ ...newAddress, cityId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={!newAddress.stateId || loadingCities}
                >
                  <option value="">
                    {!newAddress.stateId 
                      ? 'Selecione um estado primeiro' 
                      : loadingCities 
                        ? 'Carregando cidades...' 
                        : 'Selecione uma cidade'}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              
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
                Adicionar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
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
                }}
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
          {isCreateMode ? (
            // Render for create mode (local addresses)
            localAddresses.map((addr, index) => (
              <Card key={`temp-${index}`} className="p-4">
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
                      <p className="text-gray-500 text-xs">
                        País: {addr.countryId} | Estado: {addr.stateId} | Cidade: {addr.cityId}
                      </p>
                    </div>
                  </div>
                  {!isViewOnly && (
                    <div className="flex gap-2 ml-4">
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
            ))
          ) : (
            // Render for view/edit mode (server addresses)
            addresses.map((userAddress, index) => {
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
                          onClick={() => setEditingAddressId(isEditing ? null : userAddress.id)}
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
