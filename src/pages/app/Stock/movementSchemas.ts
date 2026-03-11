/**
 * Movement (ingredient-transaction) form schema
 * unitPrice in reais in form; API uses centavos
 */

import { z } from 'zod';

export const movementFormSchema = z.object({
  branchId: z.string().min(1, 'Filial é obrigatória'),
  ingredientId: z.string().min(1, 'Ingrediente é obrigatório'),
  type: z.enum(['input', 'output']),
  quantity: z.coerce.number().min(1, 'Quantidade deve ser ≥ 1'),
  unitPrice: z.coerce.number().min(0).optional(),
  description: z.string().max(500).optional().or(z.literal('')),
});

export type MovementFormData = z.infer<typeof movementFormSchema>;
