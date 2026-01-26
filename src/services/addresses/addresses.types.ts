/**
 * Address service types
 */

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
