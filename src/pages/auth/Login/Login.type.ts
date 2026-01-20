import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido').nonempty('E-mail é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginData = z.infer<typeof loginSchema>;
