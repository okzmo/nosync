import { browser } from '$app/environment';
import { auth } from '$lib/stores/auth.svelte';
import { space } from '$lib/stores/space.svelte';

export const load = async ({ url }) => {
	if (!browser) return;
	await auth.check();

	const splitUrl = url.pathname.split('/');
	const spaceName = decodeURIComponent(splitUrl[1]);
	const branchName = decodeURIComponent(splitUrl[2]);

	const { s, b } = space.has(spaceName, branchName);

	if (spaceName && branchName && s && b) {
		return;
	}

	if (s && b) {
		space.goto(s, b);
	} else if (s) {
		space.goto(s);
	} else {
		space.goto_first_space();
	}
};
