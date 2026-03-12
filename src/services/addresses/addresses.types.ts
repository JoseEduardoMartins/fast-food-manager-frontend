/**
 * Address service types
 */

export interface Country {
  id: string;
  name: string;
  shortName: string;
  phoneCode: string;
}

export interface State {
  id: string;
  name: string;
  shortName: string;
  countryId: string;
}

export interface City {
  id: string;
  name: string;
  stateId: string;
}

export interface Address {
  id: string;
  street: string;
  number?: string;
  complement?: string;
  zipcode?: string;
  countryId: string;
  stateId: string;
  cityId: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Relações (quando incluídas via selectFields)
  country?: Country;
  state?: State;
  city?: City;
}

export interface CreateAddressRequest {
  street: string;
  number?: string;
  complement?: string;
  zipcode?: string;
  countryId: string;
  stateId: string;
  cityId: string;
}

export interface CreateAddressResponse {
  id: string;
}

export interface UpdateAddressRequest {
  street?: string;
  number?: string;
  complement?: string;
  zipcode?: string;
  countryId?: string;
  stateId?: string;
  cityId?: string;
}
