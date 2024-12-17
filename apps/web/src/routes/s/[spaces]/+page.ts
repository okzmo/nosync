import { gallery } from '$lib/stores/gallery.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const photos = await gallery.getPhotos();

	return photos;
};
