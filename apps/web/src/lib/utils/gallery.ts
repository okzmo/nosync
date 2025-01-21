import { mainStore, GUTTER } from '$lib/stores/mainStore.svelte';
import type { ApiCell } from '$lib/types/api';
import type { TNote, TPhoto } from '$lib/types/space';
import { formatDate } from './date';
import { blurhashToDataURL, generateMaximizedSize } from './media';

export function calculateNoteSize(cell: ApiCell): TNote {
	const colWidth = mainStore.colWidth;

	const p: TNote = {
		id: cell.id,
		type: 'note',
		title: cell.title,
		content: cell.content,
		width: Math.floor(colWidth),
		height: Math.floor(colWidth),
		x: 0,
		y: 0,
		tags: cell.tags,
		createdAt: formatDate(cell.createdAt)
	};

	return p;
}

export function calculateCellPosition(cell: TPhoto | TNote) {
	const columns = mainStore.nbColumns;
	const columnWidth = mainStore.colWidth;
	const columnHeights = mainStore.columnHeights;

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

export function calculatePhotoSize(cell: ApiCell) {
	const photo = cell.media;
	const colWidth = mainStore.colWidth;
	const aspectRatio = photo.width / photo.height;
	const picHeight = colWidth / aspectRatio;
	const maximizedSize = generateMaximizedSize(photo.height, photo.width);

	const p: TPhoto = {
		id: cell.id,
		type: 'media',
		title: cell.title,
		content: cell.content,
		tags: '',
		originalUrl: photo.originalUrl === '' ? '' : photo.originalUrl,
		resizedUrl: photo.resizedUrl === '' ? photo.blurUrl : photo.resizedUrl,
		blurUrl: photo.blurUrl,
		originalHeight: maximizedSize.height,
		originalWidth: maximizedSize.width,
		width: Math.floor(colWidth),
		height: Math.floor(picHeight),
		x: 0,
		y: 0,
		aspectRatio: aspectRatio,
		createdAt: formatDate(cell.createdAt)
	};

	return p;
}
