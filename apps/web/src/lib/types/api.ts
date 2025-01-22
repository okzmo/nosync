import type { JSONContent } from '@tiptap/core';

export interface ApiCell {
	id: number;
	branchId: number;
	title: string;
	type: string;
	content: JSONContent;
	tags: string;
	media: ApiMedia;
	createdAt: string;
	updatedAt: string;
}

export interface ApiMedia {
	id: number;
	cellId: number;
	url: string;
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

export interface TransmitUpdateResizedImage {
	type: string;
	cellId: number;
	resizedUrl: string;
}

export interface TransmitUpdateOriginal {
	type: string;
	cellId: number;
	originalUrl: string;
}

export interface TransmitUpdateTags {
	type: string;
	cellId: number;
	tags: string;
}

export interface TransmitUpdateThumbnail {
	type: string;
	cellId: number;
	thumbnailUrl: string;
}
