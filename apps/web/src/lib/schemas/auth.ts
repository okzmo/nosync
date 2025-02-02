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

export const recoveryPasswordFromEmail = z.object({
	email: z.string().email('Please enter a valid email.')
});
export type RecoveryPasswordFromEmailForm = z.infer<typeof recoveryPasswordFromEmail>;

export const recoveryPassword = z.object({
	password: z.string().min(8, 'must be longer than 8 characters.')
});
export type RecoveryPasswordForm = z.infer<typeof recoveryPassword>;

export const passwordSchema = z
	.object({
		currentPassword: z.string().min(8, 'Must be longer than 8 characters.'),
		newPassword: z.string().min(8, 'Must be longer than 8 characters.'),
		confirm: z.string().min(8, 'Must be longer than 8 characters.')
	})
	.refine((data) => data.newPassword === data.confirm, {
		message: "Passwords don't match",
		path: ['confirm']
	});
export type PasswordForm = z.infer<typeof passwordSchema>;

export const emailSchema = z.object({
	email: z.string().email('Not a valid email')
});
