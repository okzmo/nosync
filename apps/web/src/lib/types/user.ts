import type { TSpace } from './space';

export type TUser = {
	email: string;
	firstTime: boolean;
	spaces: TSpace[];
};
