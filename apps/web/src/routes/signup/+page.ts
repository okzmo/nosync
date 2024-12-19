import { superValidate } from 'sveltekit-superforms';
import type { PageLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { register } from '$lib/schemas/auth';
import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/stores/auth.svelte';

export const load: PageLoad = async () => {
	const response = await auth.check();

	if (response.status === 'success') {
		redirect(302, '/s');
	}

	return {
		form: await superValidate(zod(register))
	};
};
