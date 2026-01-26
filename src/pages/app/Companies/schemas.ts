/**
 * Company form validation schema
 * Shared across create and edit pages
 */

import { z } from 'zod';

/**
 * CNPJ validation regex (accepts formatted or unformatted)
 */
const cnpjRegex = /^(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})$/;

/**
 * Company form schema - used for both create and edit
 */
export const companyFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(300, 'Nome deve ter no máximo 300 caracteres').trim(),
  cnpj: z.string()
    .min(1, 'CNPJ é obrigatório')
    .max(18, 'CNPJ deve ter no máximo 18 caracteres')
    .refine((val) => cnpjRegex.test(val.replace(/[^\d]/g, '')), {
      message: 'CNPJ inválido',
    }),
  phone: z.string()
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional()
    .or(z.literal('')),
  addressId: z.string().min(1, 'Endereço é obrigatório'),
  isActive: z.boolean().optional(),
});

/**
 * Type inference from schema
 */
export type CompanyFormData = z.infer<typeof companyFormSchema>;
