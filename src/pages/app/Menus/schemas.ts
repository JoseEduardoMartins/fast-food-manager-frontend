/**
 * Menu form validation schema
 */

import { z } from 'zod';

export const menuFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(300, 'Nome deve ter no máximo 300 caracteres')
    .trim(),
  isActive: z.boolean().optional(),
});

export type MenuFormData = z.infer<typeof menuFormSchema>;
