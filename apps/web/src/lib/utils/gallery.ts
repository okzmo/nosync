import type { TPhoto } from '$lib/types/space';
import { global, GUTTER } from '$lib/stores/global.svelte';

export const columnHeights = Array(global.nbColumns).fill(0);

export function calculatePhotoSize(cell) {
	const photo = cell.media;
	const colWidth = global.colWidth;
	const aspectRatio = photo.width / photo.height;
	const picHeight = colWidth / aspectRatio;

	const p: TPhoto = {
		type: 'media',
		title: cell.title,
		content: cell.content,
		blurHash: '',
		url: photo.url,
		width: Math.floor(colWidth),
		height: Math.floor(picHeight),
		x: 0,
		y: 0,
		aspectRatio: aspectRatio
	};

	return p;
}

export function calculatePhotoPosition(photo: TPhoto) {
	const columns = global.nbColumns;
	const columnWidth = global.colWidth;

	let minHeightColumn = 0;
	for (let i = 1; i < columns; i++) {
		if (columnHeights[i] < columnHeights[minHeightColumn]) {
			minHeightColumn = i;
		}
	}

	photo.x = columnWidth * minHeightColumn + GUTTER * minHeightColumn;
	photo.y = columnHeights[minHeightColumn];

	columnHeights[minHeightColumn] += photo.height + GUTTER;

	return photo;
}
