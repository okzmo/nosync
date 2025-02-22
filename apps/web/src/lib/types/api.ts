import type { JSONContent } from '@tiptap/core';

export interface ApiCell {
	id: string;
	branchId: number;
	title: string;
	type: string;
	content: JSONContent;
	tags: string;
	media: ApiMedia;
	sourceUrl: string;
	createdAt: string;
	updatedAt: string;
}

export interface ApiMedia {
	id: number;
	cellId: string;
	width: number;
	height: number;
	mime: string;
	duration: number;
	fileSize: number;
	thumbnailUrl: string;
	originalUrl: string;
	resizedUrl: string;
	blurUrl: string;
}

export type TransmitMessages =
	| TransmitUpdateBlurImage
	| TransmitUpdateResizedImage
	| TransmitUpdateOriginal
	| TransmitUpdateTags
	| TransmitUpdateThumbnail
	| TransmitAddCellFromExtension;

export interface TransmitUpdateResizedImage {
	type: 'branch:finishResizedImageUpload';
	cellId: string;
	resizedUrl: string;
}

export interface TransmitUpdateBlurImage {
	type: 'branch:finishBlurredImageUpload' | 'branch:finishBlurredThumbnailVideoUpload';
	cellId: string;
	blurUrl: string;
}

export interface TransmitAddCellFromExtension {
	type: 'branch:cellFromExtensionCreated';
	cell: ApiCell;
}

export interface TransmitUpdateOriginal {
	type:
		| 'branch:finishOriginalImageUpload'
		| 'branch:finishOriginalVideoUpload'
		| 'branch:finishOriginalFileUpload';
	cellId: string;
	originalUrl: string;
}

export interface TransmitUpdateTags {
	type: 'branch:finishTagsCreation';
	cellId: string;
	tags: string;
}

export interface TransmitUpdateThumbnail {
	type: 'branch:finishThumbnailVideoUpload';
	cellId: string;
	thumbnailUrl: string;
}
