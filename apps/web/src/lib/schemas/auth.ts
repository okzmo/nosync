import { z } from 'zod';

export const register = z.object({
	email: z.string().email('Please enter a valid email.'),
	password: z.string().min(8, 'must be longer than 8 characters.')
});

export type RegisterForm = z.infer<typeof register>;

export const login = z.object({
	email: z.string().email('Please enter a valid email.'),
	password: z.string()
});

export type LoginForm = z.infer<typeof login>;
