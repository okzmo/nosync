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
	blurHash: string;
	url: string;
	width: number;
	height: number;
	x: number;
	y: number;
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
