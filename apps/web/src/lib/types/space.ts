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
	url: string;
	width: number;
	height: number;
	x: number;
	y: number;
};
