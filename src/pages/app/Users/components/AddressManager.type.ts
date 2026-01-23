/**
 * AddressManager types
 */

import type { UserAddress, UserAddressInput } from '@services/users';

export interface AddressManagerProps {
  addresses?: UserAddress[];
  mode: 'create' | 'view' | 'edit';
  userId?: string;
  onAddressChange?: () => void; // Para modo edit/view (atualiza via API)
  onAddressesChange?: (addresses: UserAddressInput[]) => void; // Para modo create (gerencia estado local)
}
