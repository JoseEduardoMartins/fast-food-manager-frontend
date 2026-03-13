/**
 * AddressManager Component
 * Manages user addresses for create, view, and edit modes
 */

import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Button, Icon, Badge, Label, FormField, AddressFormFields } from '@components';
import { useAddressLocation } from '@common/hooks';
import { removeUserAddress, updateUserAddress } from '@services/users';
import type { UserAddressInput, UserAddress } from '@services/users';
import type { AddressManagerProps } from './AddressManager.type';
import type { Country } from '@services/countries';
import type { State } from '@services/states';
import type { City } from '@services/cities';

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

  const { loadCountries, loadStates, loadCities } = useAddressLocation();

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
        selectedCountry = countriesData.find((c) => c.id === newAddress.countryId);
      }
      if (newAddress.stateId && newAddress.countryId) {
        const statesData = await loadStates({ countryId: newAddress.countryId });
        selectedState = statesData.find((s) => s.id === newAddress.stateId);
      }
      if (newAddress.cityId && newAddress.stateId) {
        const citiesData = await loadCities({ stateId: newAddress.stateId });
        selectedCity = citiesData.find((c) => c.id === newAddress.cityId);
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
            <AddressFormFields
              value={{
                street: newAddress.street,
                number: newAddress.number ?? '',
                complement: newAddress.complement ?? '',
                zipcode: newAddress.zipcode ?? '',
                countryId: newAddress.countryId,
                stateId: newAddress.stateId,
                cityId: newAddress.cityId,
                label: newAddress.label ?? '',
                isDefault: newAddress.isDefault ?? false,
              }}
              onChange={(v) =>
                setNewAddress({
                  ...newAddress,
                  street: v.street,
                  number: v.number,
                  complement: v.complement,
                  zipcode: v.zipcode,
                  countryId: v.countryId,
                  stateId: v.stateId,
                  cityId: v.cityId,
                  label: v.label,
                  isDefault: v.isDefault ?? false,
                })
              }
              showLabelAndDefault
              required
            />
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
