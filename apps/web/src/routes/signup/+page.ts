import { tuyau } from '$lib/api';
import { login } from '$lib/schemas/auth';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const response = await tuyau.v1.auth.valid.$get();

	if (response.status === 202) {
		throw redirect(302, '/s');
	}

	return {
		form: await superValidate(zod(login))
	};
};
