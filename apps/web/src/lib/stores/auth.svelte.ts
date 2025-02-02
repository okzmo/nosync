import { tuyau } from '$lib/api';
import type { TUser } from '$lib/types/user';
import { redirect } from '@sveltejs/kit';

class Auth {
	user = $state<TUser>();

	async check() {
		const { data, error } = await tuyau.v1.auth.valid.$get();

		if (error) {
			throw redirect(303, '/signin');
		}

		console.log(data);
		this.user = {
			...data.user,
			spaces: data.spaces
		};
	}
}

export const auth = new Auth();
