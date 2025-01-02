export interface ApiCell {
	id: number;
	branch_id: number;
	title: string;
	type: string;
	content: string;
	tags: string;
	media: ApiMedia;
}

export interface ApiMedia {
	id: number;
	cell_id: number;
	url: string;
	width: number;
	height: number;
	mime: string;
	duration: number;
	blur_hash: string;
	file_size: number;
	thumbnail_url: string;
}

export interface TransmitUpdateImage {
	type: string;
	cellId: number;
	tags: string;
	imageUrl: string;
}
