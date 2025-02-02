import type { LayoutLoad } from './$types';
import { tuyau } from '$lib/api';
import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/stores/auth.svelte';

export const load: LayoutLoad = async ({ url }) => {
	const { data, error } = await tuyau.v1.auth.valid.$get();

	auth.user = {
		...data.user,
		spaces: data.spaces
	};

	if (error) {
		throw redirect(303, '/signin');
	} else if (url.pathname === '/settings') {
		throw redirect(303, '/settings/profile');
	}
};
