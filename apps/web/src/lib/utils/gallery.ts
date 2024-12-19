import type { TPhoto } from '$lib/types/space';
import { global, GUTTER } from '$lib/stores/global.svelte';
import { branch } from '$lib/stores/branch.svelte';

export function calculatePhotoSize(photo) {
	const colWidth = global.colWidth;
	const aspectRatio = photo.width / photo.height;
	const picHeight = colWidth / aspectRatio;

	const p: TPhoto = {
		url: photo.url,
		width: Math.floor(colWidth),
		height: Math.floor(picHeight),
		x: 0,
		y: 0
	};

	return p;
}

export function calculatePhotoPosition(photo: TPhoto) {
	const columns = global.nbColumns;
	const column_size = global.colWidth;

	const idx = branch.shownCells.length;
	const prevPhoto = branch.shownCells[idx - columns];

	const column = idx % columns;
	photo.x = column_size * column + GUTTER * column;

	if (idx >= columns) {
		const row = Math.floor(idx / columns);
		const prev_photo_height = prevPhoto.height;
		const prev_photo_y = prevPhoto.y === 0 ? 0 : prevPhoto.y - 14 * (row - 1);

		photo.y = Math.floor(prev_photo_y + prev_photo_height + GUTTER * row);
	}

	return photo;
}
