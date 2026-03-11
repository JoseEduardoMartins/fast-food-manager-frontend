/**
 * Order form validation schema
 * Total and items: total is sent in centavos; unitPrice in items in centavos.
 */

import { z } from 'zod';
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  CONSUMPTION_MODE,
} from '@common/constants/orderEnums';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Produto é obrigatório'),
  quantity: z.coerce.number().int().min(1, 'Quantidade mínima é 1'),
  unitPrice: z.coerce.number().min(0, 'Preço unitário deve ser ≥ 0'), // in reais for UX
  note: z.string().max(500).optional().or(z.literal('')),
});

export const orderFormSchema = z
  .object({
    branchId: z.string().min(1, 'Filial é obrigatória'),
    consumptionMode: z.enum([
      CONSUMPTION_MODE.local,
      CONSUMPTION_MODE.takeout,
      CONSUMPTION_MODE.delivery,
    ]),
    deliveryAddressId: z.string().optional().or(z.literal('')),
    clientId: z.string().optional().or(z.literal('')),
    attendantId: z.string().optional().or(z.literal('')),
    status: z.enum([
      ORDER_STATUS.received,
      ORDER_STATUS.preparing,
      ORDER_STATUS.ready,
      ORDER_STATUS.delivered,
      ORDER_STATUS.cancelled,
    ]),
    paymentMethod: z
      .enum([
        PAYMENT_METHOD.cash,
        PAYMENT_METHOD.debit,
        PAYMENT_METHOD.credit,
        PAYMENT_METHOD.pix,
        PAYMENT_METHOD.voucher,
      ])
      .optional(),
    total: z.coerce.number().min(0, 'Total deve ser ≥ 0'), // in reais for UX
    items: z.array(orderItemSchema).min(0),
  })
  .refine(
    (data) => {
      if (data.consumptionMode !== CONSUMPTION_MODE.delivery) return true;
      return !!data.deliveryAddressId?.trim();
    },
    { message: 'Endereço de entrega é obrigatório para entrega', path: ['deliveryAddressId'] }
  );

export type OrderFormData = z.infer<typeof orderFormSchema>;
export type OrderItemFormData = z.infer<typeof orderItemSchema>;
