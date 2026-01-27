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
 * Address schema for company forms
 */
export const companyAddressSchema = z.object({
  street: z.string().min(1, 'Rua é obrigatória').max(300, 'Rua deve ter no máximo 300 caracteres').trim(),
  number: z.string().max(10, 'Número deve ter no máximo 10 caracteres').optional().or(z.literal('')),
  complement: z.string().max(100, 'Complemento deve ter no máximo 100 caracteres').optional().or(z.literal('')),
  zipcode: z.string().max(20, 'CEP deve ter no máximo 20 caracteres').optional().or(z.literal('')),
  countryId: z.string().min(1, 'País é obrigatório'),
  stateId: z.string().min(1, 'Estado é obrigatório'),
  cityId: z.string().min(1, 'Cidade é obrigatória'),
});

/**
 * Company form schema - used for both create and edit
 * Note: isActive is not available in creation (always true)
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
  address: companyAddressSchema,
  isActive: z.boolean().optional(), // Only available in edit mode
});

/**
 * Type inference from schema
 */
export type CompanyFormData = z.infer<typeof companyFormSchema>;
export type CompanyAddressFormData = z.infer<typeof companyAddressSchema>;
