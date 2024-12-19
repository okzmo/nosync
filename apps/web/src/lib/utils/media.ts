export type FileMetadata = {
	name: string;
	mime: string;
	size: number;
	width: number;
	height: number;
	duration: number;
};
export async function getMediaMetadata(file: File): Promise<FileMetadata> {
	const metadata: FileMetadata = {
		name: file.name,
		mime: file.type,
		size: file.size,
		width: 0,
		height: 0,
		duration: 0
	};

	if (file.type.startsWith('image/')) {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				metadata.width = img.width;
				metadata.height = img.height;
				URL.revokeObjectURL(img.src);
				resolve(metadata);
			};
			img.src = URL.createObjectURL(file);
		});
	}

	if (file.type.startsWith('video/')) {
		return new Promise((resolve) => {
			const video = document.createElement('video');
			video.onloadedmetadata = () => {
				metadata.width = video.videoWidth;
				metadata.height = video.videoHeight;
				metadata.duration = video.duration;
				URL.revokeObjectURL(video.src);
				resolve(metadata);
			};
			video.src = URL.createObjectURL(file);
		});
	}

	return metadata;
}
