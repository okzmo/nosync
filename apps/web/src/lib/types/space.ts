import type { JSONContent } from '@tiptap/core';

export type CellType = 'media' | 'note' | 'default';

export type TSpace = {
	id: number;
	ownerId: number;
	name: string;
	branches: TBranch[];
};

export type TBranch = {
	id: number;
	spaceId: number;
	name: string;
};

export type TCell = TPhoto | TNote;

export type TDefault = {
	id: number;
	type: 'default';
	width: number;
	height: number;
	x: number;
	y: number;
};

export type TPhoto = {
	id: number;
	type: 'media';
	title: string;
	content: JSONContent | undefined;
	blurHash: string;
	url: string;
	width: number;
	height: number;
	originalWidth: number;
	originalHeight: number;
	tags: string;
	x: number;
	y: number;
	aspectRatio: number;
	createdAt: string;
};

export type TNote = {
	id: number;
	type: 'note';
	title: string;
	content: JSONContent | undefined;
	width: number;
	tags: string;
	height: number;
	x: number;
	y: number;
	createdAt: string;
};
