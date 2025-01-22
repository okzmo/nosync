import { decode } from 'blurhash';

export type FileMetadata = {
	name: string;
	mime: string;
	size: number;
	width: number;
	height: number;
	duration: number;
	firstFrame?: Blob;
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
		return new Promise((resolve, reject) => {
			const video = document.createElement('video');

			const blob = new Blob([file], { type: file.type });
			const url = URL.createObjectURL(blob);
			video.src = url;
			video.autoplay = true;
			video.muted = true;

			const cleanup = () => {
				video.removeAttribute('src');
				URL.revokeObjectURL(url);
			};

			video.onerror = () => {
				cleanup();
				reject(new Error(`Failed to upload the video: ${video.error?.message}`));
			};

			video.onloadedmetadata = async () => {
				metadata.width = video.videoWidth;
				metadata.height = video.videoHeight;
				metadata.duration = Math.floor(video.duration);

				const thumbnail = (await generateThumbnail(video)) as Blob;
				metadata.firstFrame = thumbnail;

				video.pause();
				cleanup();
				resolve(metadata);
			};
		});
	}

	return metadata;
}

const generateThumbnail = async (video: HTMLVideoElement) => {
	return new Promise((resolve) => {
		video.onseeked = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

			canvas.toBlob((blob) => {
				resolve(blob);
			}, 'image/jpeg');
		};
		video.currentTime = 0.1;
	});
};

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
