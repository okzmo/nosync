import { decode } from 'blurhash';

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
export function blurhashToDataURL(blurhash: string, width = 32, height = 32) {
	const pixels = decode(blurhash, width, height);
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	const imageData = ctx!.createImageData(width, height);
	imageData.data.set(pixels);
	ctx!.putImageData(imageData, 0, 0);
	return canvas.toDataURL();
}

export function generateMaximizedSize(originalHeight: number, originalWidth: number) {
	const vHeight = window.innerHeight * 0.8;
	const vWidth = window.innerWidth * 0.8;

	const aspectRatio = originalWidth / originalHeight;

	let newWidth = originalWidth;
	let newHeight = originalHeight;

	if (originalWidth > vWidth || originalHeight > vHeight) {
		if (vWidth / vHeight > aspectRatio) {
			newHeight = vHeight;
			newWidth = vHeight * aspectRatio;
		} else {
			newWidth = vWidth;
			newHeight = vWidth / aspectRatio;
		}
	}

	return { height: newHeight, width: newWidth };
}
