import { superValidate } from 'sveltekit-superforms';
import type { PageLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { spaceCreation } from '$lib/schemas/space';

export const load: PageLoad = async () => {
	return {
		form: await superValidate(zod(spaceCreation))
	};
};
