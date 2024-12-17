import { z } from 'zod';

export const spaceCreation = z.object({
	name: z.string().max(32, 'The name can contain at most 32 characters.')
});

export type SpaceForm = z.infer<typeof spaceCreation>;
