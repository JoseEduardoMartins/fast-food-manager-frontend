/**
 * Branch form validation schema
 * Shared across create and edit pages
 */

import { z } from 'zod';

/**
 * Branch form schema - used for both create and edit
 * Note: isActive is not available in creation (always true)
 */
export const branchFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(300, 'Nome deve ter no máximo 300 caracteres').trim(),
  companyId: z.string().min(1, 'Empresa é obrigatória'),
  menuId: z.string().min(1, 'Menu é obrigatório'),
  addressId: z.string().min(1, 'Endereço é obrigatório'),
  phone: z.string()
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional(), // Only available in edit mode
});

/**
 * Type inference from schema
 */
export type BranchFormData = z.infer<typeof branchFormSchema>;
