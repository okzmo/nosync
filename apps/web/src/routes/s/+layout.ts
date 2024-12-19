import { auth } from '$lib/stores/auth.svelte';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';
import { space } from '$lib/stores/space.svelte';
import type { TSpace } from '$lib/types/space';

export const load: PageLoad = async ({ url }) => {
	const response = await auth.check();

	if (!browser) return;

	if (response?.status === 'error.auth_invalid') {
		redirect(303, '/signin');
	}

	const u = url.pathname.split('/');
	if (u.length === 4 && space.has(u[2], u[3])) {
		console.log(space.currentBranch.id, space.currentSpace.id);
		return;
	}

	if (u.length === 2) {
		if (auth.user!.spaces.length > 0) {
			space.goto_first_space();
		}
	} else if (u.length === 3) {
		const s = space.has(u[2]);
		if (s) {
			space.goto(s as TSpace);
		} else {
			space.goto_first_space();
		}
	} else if (u.length === 4) {
		const res = space.has(u[2], u[3]);
		if (!res) {
			space.goto(res!.space, res!.branch);
		} else {
			space.goto_first_space();
		}
	}
};
