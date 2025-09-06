import { z } from 'zod';

export const noteValidation = z.object({
  title: z.string().max(20, 'The name must contain at most 20 characters.').trim()
});

export type NoteValidation = z.infer<typeof noteValidation>;
