/**
 * Helper to extract role code from user object
 * Handles both legacy string role and RBAC object role
 */

import type { UserRole } from '@services/auth';

/**
 * RBAC Role interface (simplified)
 */
interface RoleObject {
  code: string;
  [key: string]: unknown;
}

/**
 * Extract role code from user.role which can be:
 * - string (legacy UserRole)
 * - object with code property (RBAC Role)
 */
export function getUserRoleCode(role: UserRole | RoleObject | undefined | null): string {
  if (!role) {
    return 'customer'; // default fallback
  }

  // If it's an object with code property (RBAC)
  if (typeof role === 'object' && 'code' in role) {
    return role.code;
  }

  // If it's a string (legacy)
  if (typeof role === 'string') {
    return role;
  }

  // Fallback
  return 'customer';
}
