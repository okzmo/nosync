import { login } from '$lib/schemas/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageLoad } from './$types';
import { auth } from '$lib/stores/auth.svelte';

export const load: PageLoad = async () => {
	await auth.check();

	return {
		form: await superValidate(zod(login))
	};
};
