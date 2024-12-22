import { tuyau } from '$lib/api/index.js';
import { space } from '$lib/stores/space.svelte.js';

export async function POST({ request, fetch }) {
	const formData = await request.formData();
	formData.append('branchId', '' + space.currentBranch!.id);

	const response = await fetch(tuyau.v1.space.upload.$url(), {
		method: 'POST',
		body: formData,
		credentials: 'include'
	});

	return response;
}
