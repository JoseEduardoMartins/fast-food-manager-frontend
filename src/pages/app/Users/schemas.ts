/**
 * User form validation schema
 * Shared across create and edit pages
 */

import { z } from 'zod';

/**
 * User form schema - used for both create and edit
 */
export const userFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').trim(),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  role: z.enum(['owner', 'manager', 'cook', 'attendant', 'customer', 'delivery'], {
    message: 'Tipo de usuário é obrigatório',
  }),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

/**
 * Type inference from schema
 */
export type UserFormData = z.infer<typeof userFormSchema>;
