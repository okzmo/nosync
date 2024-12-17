import { auth } from '$lib/stores/auth.svelte';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './[spaces]/$types';
import { browser } from '$app/environment';
import { space } from '$lib/stores/space.svelte';

export const load: PageLoad = async ({ url }) => {
  const response = await auth.check();

  if (!browser) return;

  if (response?.status === 'error.auth_invalid') {
    redirect(304, '/auth');
  }

  if (url.pathname === "/s") {
    if (auth.user!.spaces.length > 0) space.goto_first_space()
  } else if (!space.has(url.pathname.slice(3))) {
    space.goto_first_space()
  }
};
