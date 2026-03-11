/**
 * Stock (branch-ingredient) form schema
 * Prices in reais in form; API uses centavos
 */

import { z } from 'zod';

export const stockFormSchema = z.object({
  branchId: z.string().min(1, 'Filial é obrigatória'),
  ingredientId: z.string().min(1, 'Ingrediente é obrigatório'),
  stockQuantity: z.coerce.number().min(0, 'Quantidade deve ser ≥ 0'),
  stockMinQuantity: z.coerce.number().min(0, 'Estoque mínimo deve ser ≥ 0'),
  purchasePrice: z.coerce.number().min(0, 'Preço de compra deve ser ≥ 0'),
  salePrice: z.coerce.number().min(0, 'Preço de venda deve ser ≥ 0').optional(),
});

export type StockFormData = z.infer<typeof stockFormSchema>;
