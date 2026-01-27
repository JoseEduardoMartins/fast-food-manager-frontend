export type AddressSelectorMode = 'create' | 'view' | 'edit';

export interface AddressSelectorProps {
  mode: AddressSelectorMode;
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
