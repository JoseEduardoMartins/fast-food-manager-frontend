/**
 * User form validation schema
 * Shared across create and edit pages
 */

import { z } from 'zod';

export const addressFormSchema = z.object({
  id: z.string().uuid().optional(),
  street: z
    .string({
      message: 'O campo é obrigatório.',
    })
    .trim(),
  number: z
    .string({
      message: 'O campo é obrigatório.',
    })
    .trim(),
  complement: z.string().trim().optional(),
  zipcode: z
    .string({
      message: 'O campo é obrigatório.',
    })
    .trim(),
  countryId: z.string().uuid({
    message: 'O campo é obrigatório.',
  }),
  stateId: z.string().uuid({
    message: 'O campo é obrigatório.',
  }),
  cityId: z.string().uuid({
    message: 'O campo é obrigatório.',
  }),
  label: z.string().trim(),
  isDefault: z.boolean({
    message: 'O campo é obrigatório.',
  }),
});

/**
 * User form schema - used for both create and edit
 */
export const userFormSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório').trim(),
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    role: z.enum(['owner', 'manager', 'cook', 'attendant', 'customer', 'delivery'], {
      message: 'Tipo de usuário é obrigatório',
    }),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
    addresses: z.array(addressFormSchema),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

/**
 * Type inference from schema
 */
export type UserFormData = z.infer<typeof userFormSchema>;
