import { getMediaMetadata, type FileMetadata } from '$lib/utils/media';
import { branch } from './branch.svelte';

class DropZone {
	isOpen = $state(false);

	handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		this.isOpen = true;
	};

	handleDragLeave = () => {
		this.isOpen = false;
	};

	handleDrop = async (e: DragEvent) => {
		e.preventDefault();
		const files = [];
		let filesMetadata = [];
		const formData = new FormData();

		if (e.dataTransfer?.items) {
			const processedFiles: Promise<FileMetadata>[] = [];
			const allItems = [...e.dataTransfer.items].filter((item) => item.kind === 'file');

			allItems.forEach((item) => {
				const file = item.getAsFile();
				processedFiles.push(getMediaMetadata(file!));
				files.push(file);
			});

			filesMetadata = await Promise.all(processedFiles);
		} else {
			const filesPromises = [...e.dataTransfer?.files].map((file) => getMediaMetadata(file));

			const processedFiles = await Promise.all(filesPromises);
			filesMetadata = processedFiles;
			files.push(...e.dataTransfer?.files);
		}

		files.forEach((file) => {
			formData.append(`files[]`, file);
		});
		filesMetadata.forEach((metadata) => {
			formData.append(`filesMetadata[]`, JSON.stringify(metadata));
		});

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});
			const data = await response.json();

			if (!response.ok) throw new Error('Upload failed');

			branch.addCells(data);
		} catch (error) {
			console.error(error);
		}

		this.isOpen = false;
	};
}

export const dropzone = new DropZone();
