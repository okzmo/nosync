import { mainStore, GUTTER } from '$lib/stores/mainStore.svelte';
import { space } from '$lib/stores/space.svelte';
import type { ApiCell } from '$lib/types/api';
import type { TNote, TPDF, TPhoto, TVideo } from '$lib/types/space';
import { formatDate } from './date';
import { cuid } from './id';
import { generateMaximizedSize, getPDFFirstPage, type FileMetadata } from './media';

export function calculateCellPosition(cell: TPhoto | TVideo | TNote | TPDF) {
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

/**
 * Give the exact size needed in the masonry grid for a note Cell
 **/
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

/**
 * Give the exact size needed in the masonry grid for a photo Cell
 **/
export function calculatePhotoSize(cell: ApiCell) {
	const photo = cell.media;
	const colWidth = mainStore.colWidth;
	const aspectRatio = photo.width / photo.height;
	const picHeight = colWidth / aspectRatio;
	const maximizedSize = generateMaximizedSize(photo.height, photo.width);

	const p: TPhoto = {
		id: cell.id,
		type: 'photo',
		title: cell.title,
		content: cell.content,
		mime: photo.mime,
		tags: '',
		originalUrl: photo.originalUrl,
		resizedUrl: photo.resizedUrl,
		blurUrl: photo.blurUrl,
		originalHeight: Math.floor(maximizedSize.height),
		originalWidth: Math.floor(maximizedSize.width),
		width: Math.floor(colWidth),
		height: Math.floor(picHeight),
		x: 0,
		y: 0,
		aspectRatio: aspectRatio,
		createdAt: formatDate(cell.createdAt),
		sourceUrl: cell.sourceUrl
	};

	return p;
}

/**
 * Give the exact size needed in the masonry grid for a video Cell
 **/
export function calculateVideoSize(cell: ApiCell) {
	const video = cell.media;
	const colWidth = mainStore.colWidth;
	const aspectRatio = video.width / video.height;
	const picHeight = colWidth / aspectRatio;
	const maximizedSize = generateMaximizedSize(video.height, video.width);

	const p: TVideo = {
		id: cell.id,
		type: 'video',
		title: cell.title,
		content: cell.content,
		mime: video.mime,
		tags: '',
		originalUrl: video.originalUrl === '' ? '' : video.originalUrl,
		thumbnailUrl: video.thumbnailUrl === '' ? video.blurUrl : video.thumbnailUrl,
		blurUrl: video.blurUrl,
		originalHeight: Math.floor(maximizedSize.height),
		originalWidth: Math.floor(maximizedSize.width),
		width: Math.floor(colWidth),
		height: Math.floor(picHeight),
		x: 0,
		y: 0,
		aspectRatio: aspectRatio,
		duration: video.duration,
		createdAt: formatDate(cell.createdAt)
	};

	return p;
}

export function calculatePdfSize(cell: ApiCell) {
	const pdf = cell.media;
	const colWidth = mainStore.colWidth;
	const aspectRatio = colWidth / (colWidth + 75);
	const picHeight = colWidth / aspectRatio;

	const p: TPDF = {
		id: cell.id,
		type: 'pdf',
		title: cell.title,
		content: cell.content,
		mime: pdf.mime,
		tags: '',
		blurUrl: pdf.blurUrl,
		originalUrl: pdf.originalUrl,
		width: Math.floor(colWidth),
		height: Math.floor(picHeight),
		x: 0,
		y: 0,
		aspectRatio: aspectRatio,
		createdAt: formatDate(cell.createdAt)
	};

	return p;
}

export async function generateBlurredImage(image: HTMLImageElement) {
	let blurredPic = '';

	const canvas = document.createElement('canvas');
	canvas.width = image.width;
	canvas.height = image.height;
	const ctx = canvas.getContext('2d')!;
	ctx.filter = 'blur(24px)';
	ctx.drawImage(image, 0, 0);

	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob((b) => resolve(b), 'image/webp', 0.5)
	);
	if (blob) {
		blurredPic = URL.createObjectURL(blob);
	}

	return blurredPic;
}

export function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = url;
	});
}

/**
 * Create a fake cell to give the user an instant feedback while we upload's data
 **/
export async function generateFakeCell(file: File, metadata: FileMetadata) {
	let blurredPic = '';

	if (metadata.mime.includes('image')) {
		const imageData = await file.arrayBuffer();
		const blobUrl = URL.createObjectURL(new Blob([imageData]));
		const image = await loadImage(blobUrl);

		blurredPic = await generateBlurredImage(image);

		URL.revokeObjectURL(blobUrl);
	}

	if (metadata.mime.includes('video') && metadata.firstFrame) {
		const blobUrl = URL.createObjectURL(metadata.firstFrame);
		const image = await loadImage(blobUrl);

		blurredPic = await generateBlurredImage(image);

		URL.revokeObjectURL(blobUrl);
	}

	if (metadata.mime === 'application/pdf') {
		blurredPic = await getPDFFirstPage({ file });
	}

	const fakeCell: ApiCell = {
		id: metadata.id,
		branchId: space.currentBranch!.id,
		title: '',
		type: metadata.mime,
		content: {},
		tags: '',
    searchContent: null,
    sourceUrl: '',
		createdAt: '',
		updatedAt: '',
		media: {
			id: cuid(),
			cellId: metadata.id,
			width: metadata.width,
			height: metadata.height,
			mime: metadata.mime,
			duration: 0,
			fileSize: metadata.size,
			thumbnailUrl: '',
			originalUrl: '',
			resizedUrl: '',
			blurUrl: blurredPic
		}
	};

	return fakeCell;
}
