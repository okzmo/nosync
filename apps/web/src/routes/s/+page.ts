import { spaceCreation } from '$lib/schemas/space';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	return {
		form: await superValidate(zod(spaceCreation))
	};
};
