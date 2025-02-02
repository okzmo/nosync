import { uploadMedia } from '$lib/utils/media';
import { panel } from './panel.svelte';

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

		await uploadMedia(e.dataTransfer?.items, e.dataTransfer?.files);
	};
}

export const dropzone = new DropZone();
