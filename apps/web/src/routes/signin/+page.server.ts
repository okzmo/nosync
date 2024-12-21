import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { login } from '$lib/schemas/auth';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { tuyau } from '$lib/api';
import { parseString, splitCookiesString } from 'set-cookie-parser';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(tuyau.v1.auth.valid.$url(), {
		credentials: 'include',
		method: 'GET'
	});

	if (response.status === 202) {
		throw redirect(302, '/s');
	}

	return {
		form: await superValidate(zod(login))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const form = await superValidate(request, zod(login));

		const response = await fetch(tuyau.v1.auth.login.$url(), {
			method: 'POST',
			body: JSON.stringify(form.data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const data = await response.json();
			return error(401, { message: data.errors[0].message });
		}

		const cookieHeaders = response.headers.get('Set-Cookie') || '';

		for (const str of splitCookiesString(cookieHeaders)) {
			const { name, value, ...options } = parseString(str);
			cookies.set(name, value, options as any);
		}

		throw redirect(302, '/s');
	}
};
