/**
 * Address formatting helper
 */

import type { Address } from '@services/addresses';

export interface AddressDisplay {
  line1: string;
  line2?: string;
  zipcode?: string;
}

export const formatAddress = (address: Address | undefined): AddressDisplay | null => {
  if (!address) return null;

  const line1 = `${address.street}${address.number ? ', ' + address.number : ''}`;
  const cityState = address.city && address.state 
    ? `${address.city.name} - ${address.state.shortName}`
    : null;

  return {
    line1,
    line2: cityState || undefined,
    zipcode: address.zipcode,
  };
};

export const formatAddressOneLine = (address: Address | undefined): string => {
  if (!address) return '';

  const parts = [
    address.street,
    address.number,
    address.city?.name,
    address.state?.shortName,
  ].filter(Boolean);

  return parts.join(', ');
};
