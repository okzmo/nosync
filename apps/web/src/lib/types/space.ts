export type CellType = 'media' | 'note';

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

export type TPhoto = {
	type: 'media';
	title: string;
	content: string;
	blurHash: string;
	url: string;
	width: number;
	height: number;
	x: number;
	y: number;
	aspectRatio: number;
};

export type TNote = {
	type: 'note';
	title: string;
	content: string;
	width: number;
	height: number;
	x: number;
	y: number;
};
