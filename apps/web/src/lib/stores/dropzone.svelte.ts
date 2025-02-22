import { uploadMedia, uploadMediaFromExt } from '$lib/utils/media';
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

		let uri =
			e.dataTransfer?.getData('text/uri-list') ||
			e.dataTransfer?.getData('text/plain') ||
			e.dataTransfer?.getData('text/x-moz-url');
		const sourceUrl = uri;

		if (uri?.split('/').at(-1)?.lastIndexOf('.') === -1) {
			const html = e.dataTransfer?.getData('text/html');
			if (!html) return;
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const img = doc.querySelector('img[src]') as HTMLImageElement;
			uri = img.srcset.split(',').at(-1)?.trim().split(' ')?.[0] || img?.src;
		}

		if (uri) {
			await uploadMediaFromExt(sourceUrl, uri);
		} else {
			await uploadMedia(e.dataTransfer?.items, e.dataTransfer?.files);
		}
	};
}

export const dropzone = new DropZone();
