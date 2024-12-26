import { tuyau } from '$lib/api';
import { getMediaMetadata, type FileMetadata } from '$lib/utils/media';
import { branch } from './branch.svelte';
import { panel } from './panel.svelte';
import { space } from './space.svelte';

class DropZone {
	isOpen = $state(false);
	dragCounter = $state(0);

	handleDragEnter = (e: DragEvent) => {
		if (panel.isOpen) return;
		e.preventDefault();
		this.dragCounter++;
		this.isOpen = true;
	};

	handleDragOver = (e: DragEvent) => {
		if (panel.isOpen) return;
		e.preventDefault();
	};

	handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		this.dragCounter--;
		if (this.dragCounter === 0) {
			this.isOpen = false;
		}
	};

	handleDrop = async (e: DragEvent) => {
		e.preventDefault();
		this.dragCounter = 0;
		this.isOpen = false;
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

		formData.append('branchId', '' + space.currentBranch!.id);
		files.forEach((file) => {
			formData.append(`files[]`, file);
		});
		filesMetadata.forEach((metadata) => {
			formData.append(`filesMetadata[]`, JSON.stringify(metadata));
		});

		const { data, error } = await tuyau.v1.space.upload.$post(formData);

		if (error) {
			console.error(error);
		}

		branch.addCells(data);
	};
}

export const dropzone = new DropZone();
