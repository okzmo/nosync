import { tuyau } from '$lib/api';
import { recoveryPasswordFromEmail } from '$lib/schemas/auth';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const { data, error } = await tuyau.v1.auth.valid.$get();

	if (!error) {
		const first_space = data.spaces[0].name.toLowerCase();
		const first_branch = data.spaces[0].branches[0].name.toLowerCase();

		throw redirect(302, `/${first_space}/${first_branch}`);
	}

	return {
		form: await superValidate(zod(recoveryPasswordFromEmail))
	};
};
