/**
 * Product form validation schema
 * Price in reais in form; API uses centavos
 */

import { z } from 'zod';

export const productIngredientSchema = z.object({
  id: z.string().optional(),
  ingredientId: z.coerce.number(),
  units: z.coerce.number().min(1, 'Unidades deve ser ≥ 1'),
  quantityPerUnit: z.coerce.number().min(1, 'Quantidade por unidade deve ser ≥ 1'),
});

export const productFormSchema = z.object({
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
  price: z.coerce.number().min(0, 'Preço deve ser ≥ 0'),
  isActive: z.boolean().optional(),
  ingredients: z.array(productIngredientSchema).optional().default([]),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
