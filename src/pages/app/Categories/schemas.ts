/**
 * Category form validation schemas
 */

import { z } from 'zod';

export const categoryFormSchema = z.object({
  menuId: z.string().min(1, 'Selecione um menu').optional(),
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(300, 'Nome deve ter no máximo 300 caracteres')
    .trim(),
  order: z.coerce.number().min(0, 'Ordem deve ser maior ou igual a 0'),
  isActive: z.boolean().optional(),
});

/** Create: menuId required */
export const createCategoryFormSchema = categoryFormSchema.extend({
  menuId: z.string().min(1, 'Selecione um menu'),
});

export const categoryEditFormSchema = categoryFormSchema.omit({ menuId: true });

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
export type CreateCategoryFormData = z.infer<typeof createCategoryFormSchema>;
export type CategoryEditFormData = z.infer<typeof categoryEditFormSchema>;
