import { tuyau } from '$lib/api';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { data, error } = await tuyau.v1.auth.valid.$get();

	if (!error && data.user.isEmailVerified) {
		const first_space = data.spaces[0].name.toLowerCase();
		const first_branch = data.spaces[0].branches[0].name.toLowerCase();

		throw redirect(302, `/${first_space}/${first_branch}`);
	}

	const { data: dataEmail, error: isInvalid } = await tuyau.v1.auth.email
		.verify({ token: params.token })
		.$post();

	return {
		message: dataEmail,
		isInvalid
	};
};
