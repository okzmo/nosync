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
	blurHash: string;
	fileSize: number;
	thumbnailUrl: string;
}

export interface TransmitUpdateImage {
	type: string;
	cellId: number;
	tags: string;
	imageUrl: string;
}
