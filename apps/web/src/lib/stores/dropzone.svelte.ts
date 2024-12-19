import { tuyau } from '$lib/api';
import { getMediaMetadata, type FileMetadata } from '$lib/utils/media';
import { branch } from './branch.svelte';
import { space } from './space.svelte';

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

		const formData = new FormData();
		files.forEach((file) => {
			formData.append(`files[]`, file);
		});
		filesMetadata.forEach((metadata) => {
			formData.append(`filesMetadata[]`, JSON.stringify(metadata));
		});
		formData.append('branchId', '' + space.currentBranch!.id);

		const { data } = await tuyau.v1.space.upload.$post(formData);
		console.log(data);
		branch.addCells(data);

		this.isOpen = false;
	};
}

export const dropzone = new DropZone();
