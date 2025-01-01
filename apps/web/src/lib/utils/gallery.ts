import { global, GUTTER } from '$lib/stores/global.svelte';
import type { TNote, TPhoto } from '$lib/types/space';
import { blurhashToDataURL, generateMaximizedSize } from './media';

export const columnHeights = Array(global.nbColumns).fill(0);

export function calculateNoteSize(cell): TNote {
	const colWidth = global.colWidth;

	const p: TNote = {
		id: cell.id,
		type: 'note',
		title: cell.title,
		content: cell.content,
		width: Math.floor(colWidth),
		height: Math.floor(colWidth),
		x: 0,
		y: 0
	};

	return p;
}

export function calculateCellPosition(cell: TPhoto | TNote) {
	const columns = global.nbColumns;
	const columnWidth = global.colWidth;

	let minHeightColumn = 0;
	for (let i = 1; i < columns; i++) {
		if (columnHeights[i] < columnHeights[minHeightColumn]) {
			minHeightColumn = i;
		}
	}

	cell.x = columnWidth * minHeightColumn + GUTTER * minHeightColumn;
	cell.y = columnHeights[minHeightColumn];

	columnHeights[minHeightColumn] += cell.height + GUTTER;

	return cell;
}

export function calculatePhotoSize(cell) {
	const photo = cell.media;
	const colWidth = global.colWidth;
	const aspectRatio = photo.width / photo.height;
	const picHeight = colWidth / aspectRatio;
	const blurHash = blurhashToDataURL(photo.blurHash);
	const maximizedSize = generateMaximizedSize(photo.height, photo.width);

	const p: TPhoto = {
		id: cell.id,
		type: 'media',
		title: cell.title,
		content: cell.content,
		blurHash: '',
		tags: '',
		url: photo.url === '' ? blurHash : photo.url,
		originalHeight: maximizedSize.height,
		originalWidth: maximizedSize.width,
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
