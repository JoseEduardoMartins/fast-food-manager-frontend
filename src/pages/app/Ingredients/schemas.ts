/**
 * Ingredient form validation schema
 * unit: g, kg, ml, L, un
 */

import { z } from 'zod';

const ingredientUnitEnum = z.enum(['g', 'kg', 'ml', 'L', 'un'], {
  message: 'Unidade inválida',
});

export const ingredientFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(300, 'Nome deve ter no máximo 300 caracteres')
    .trim(),
  description: z
    .string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional()
    .or(z.literal('')),
  unit: ingredientUnitEnum,
});

export type IngredientFormData = z.infer<typeof ingredientFormSchema>;
