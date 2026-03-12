/**
 * AddressManager types
 * addresses can be UserAddress[] (view / server) or UserAddressInput[] (edit / controlled by parent)
 */
import type { UserAddress, UserAddressInput } from '@services/users';

export interface AddressManagerProps {
  addresses?: UserAddress[] | UserAddressInput[];
  mode: 'create' | 'view' | 'edit';
  userId?: string;
  onAddressChange?: () => void;
  onAddressesChange?: (addresses: UserAddressInput[]) => void;
}
