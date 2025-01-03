import { spaceCreation } from '$lib/schemas/space';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { tuyau } from '$lib/api';

export const load: PageLoad = async () => {
	const { data, error } = await tuyau.v1.auth.valid.$get();

	if (!error && data?.spaces.length > 0) {
		const first_space = data.spaces[0].name.toLowerCase();
		const first_branch = data.spaces[0].branches[0].name.toLowerCase();

		throw redirect(302, `/${first_space}/${first_branch}`);
	}

	return {
		form: await superValidate(zod(spaceCreation))
	};
};
