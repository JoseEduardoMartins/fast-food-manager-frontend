/**
 * User form validation schemas
 * Shared across create, view, and edit pages
 */

import { z } from 'zod';

/**
 * Base user schema - fields common to create and update
 */
const baseUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').trim(),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  role: z.enum(['owner', 'manager', 'cook', 'attendant', 'customer', 'delivery'], {
    message: 'Tipo de usuário é obrigatório',
  }),
  isActive: z.boolean().default(true),
});

/**
 * Create user schema - password is required
 */
export const createUserSchema = baseUserSchema.extend({
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

/**
 * Update user schema - password is optional
 */
export const updateUserSchema = baseUserSchema.extend({
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  // Only validate password match if password is provided
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

/**
 * Type inference from schemas
 */
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UserFormData = CreateUserFormData | UpdateUserFormData;
