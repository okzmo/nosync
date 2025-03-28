import type { TSpace } from './space';

export type TUser = {
	id: number;
	email: string;
	firstTime: boolean;
	spaces: TSpace[];
	isEmailVerified: boolean;
	updatedAt: string;
	createdAt: string;
};
