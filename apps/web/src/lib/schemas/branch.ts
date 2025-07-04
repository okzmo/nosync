import { z } from 'zod';

export const branchValidation = z.object({
  name: z.string().min(1, 'The name must contain at least 1 character.').max(20, 'The name must contain at most 20 characters.').trim()
});

export type BranchValidation = z.infer<typeof branchValidation>;
