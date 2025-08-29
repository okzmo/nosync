import { z } from 'zod';

export const fileValidation = z.object({
  title: z.string().max(20, 'The name must contain at most 20 characters.').trim()
});

export type FileValidation = z.infer<typeof fileValidation>;
