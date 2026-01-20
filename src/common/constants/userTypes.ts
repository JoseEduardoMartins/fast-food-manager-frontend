/**
 * User type constants
 * User types available in the application
 */

export type UserType = 'customer' | 'owner';

export const USER_TYPES = {
  CUSTOMER: 'customer' as const,
  OWNER: 'owner' as const,
} as const;

export const USER_TYPE_LABELS: Record<UserType, string> = {
  customer: 'Cliente',
  owner: 'Proprietário',
} as const;
