import { superValidate } from 'sveltekit-superforms';
import { spaceCreation } from '$lib/schemas/space';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { redirect, type Actions } from '@sveltejs/kit';
import { tuyau } from '$lib/api';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(spaceCreation))
	};
};

// export const actions: Actions = {
// 	default: async ({ request, fetch }) => {
// 		const form = await superValidate(request, zod(spaceCreation));
//
// 		try {
// 			const response = await fetch(tuyau.v1.space.create.$url(), {
// 				method: 'POST',
// 				credentials: 'include',
// 				body: JSON.stringify(form.data),
// 				headers: {
// 					'Content-Type': 'application/json'
// 				}
// 			});
// 			const data = await response.json();
//
// 			if (!response.ok) {
// 				console.error(data);
// 				throw new Error('Error during space creation');
// 			}
//
// 			throw redirect(302, `/s/${form.data.name.toLowerCase()}`);
// 		} catch (error) {
// 			console.error(error);
// 		}
// 	}
// };
