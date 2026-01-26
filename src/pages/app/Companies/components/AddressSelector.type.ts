export type AddressSelectorMode = 'create' | 'view' | 'edit';

export interface AddressSelectorProps {
  mode: AddressSelectorMode;
  addressId?: string;
  onAddressChange: (addressId: string) => void;
  onAddressDataChange?: (data: AddressData) => void;
  disabled?: boolean;
}

export interface AddressData {
  street: string;
  number?: string;
  complement?: string;
  zipcode?: string;
  countryId: string;
  stateId: string;
  cityId: string;
}
