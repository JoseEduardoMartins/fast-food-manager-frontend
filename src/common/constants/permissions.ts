/**
 * Permission codes (RBAC)
 * Format: <resource>.<action>
 * Backend derives required permission from route + HTTP method
 */

export const PERMISSIONS = {
  users: {
    list: 'users.list',
    read: 'users.read',
    create: 'users.create',
    update: 'users.update',
    delete: 'users.delete',
  },
  companies: {
    list: 'companies.list',
    read: 'companies.read',
    create: 'companies.create',
    update: 'companies.update',
    delete: 'companies.delete',
  },
  branches: {
    list: 'branches.list',
    read: 'branches.read',
    create: 'branches.create',
    update: 'branches.update',
    delete: 'branches.delete',
  },
  menus: {
    list: 'menus.list',
    read: 'menus.read',
    create: 'menus.create',
    update: 'menus.update',
    delete: 'menus.delete',
  },
  categories: {
    list: 'categories.list',
    read: 'categories.read',
    create: 'categories.create',
    update: 'categories.update',
    delete: 'categories.delete',
  },
  products: {
    list: 'products.list',
    read: 'products.read',
    create: 'products.create',
    update: 'products.update',
    delete: 'products.delete',
  },
  orders: {
    list: 'orders.list',
    read: 'orders.read',
    create: 'orders.create',
    update: 'orders.update',
    delete: 'orders.delete',
  },
  ingredients: {
    list: 'ingredients.list',
    read: 'ingredients.read',
    create: 'ingredients.create',
    update: 'ingredients.update',
    delete: 'ingredients.delete',
  },
  roles: {
    list: 'roles.list',
    read: 'roles.read',
    create: 'roles.create',
    update: 'roles.update',
    delete: 'roles.delete',
  },
  orderDeliveries: {
    list: 'order-deliveries.list',
    read: 'order-deliveries.read',
    create: 'order-deliveries.create',
    update: 'order-deliveries.update',
    delete: 'order-deliveries.delete',
  },
  addresses: {
    list: 'addresses.list',
    read: 'addresses.read',
    create: 'addresses.create',
    update: 'addresses.update',
    delete: 'addresses.delete',
  },
} as const;

export type PermissionCode = string;

/** Flat list of all permission codes for role assignment UI */
export const ALL_PERMISSION_CODES: string[] = Object.values(PERMISSIONS).flatMap((resource) =>
  Object.values(resource)
);

/** Grouped by resource for permission matrix UI */
export const PERMISSIONS_BY_RESOURCE: Record<string, string[]> = Object.fromEntries(
  Object.entries(PERMISSIONS).map(([resource, actions]) => [
    resource,
    Object.values(actions),
  ])
);
