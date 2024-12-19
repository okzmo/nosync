import { tuyau } from '$lib/api';
import type { TPhoto } from '$lib/types/space';
import { calculatePhotoPosition, calculatePhotoSize } from '$lib/utils/gallery';
import { space } from './space.svelte';

class Branch {
	cells = $state<TPhoto[]>([]);
	shownCells = $state<TPhoto[]>([]);
	activeCell = $state(-1);

	async getCells() {
		const { data } = await tuyau.v1.branch({ branchId: '' + space.currentBranch?.id }).$get();

		return data;
	}

	processCells(cells) {
		this.shownCells = [];
		for (const cell of cells) {
			if (cell.type.startsWith('image') || cell.type.startsWith('video')) {
				const photo = cell.media;
				const photo_size = calculatePhotoSize(photo);
				const photo_pos = calculatePhotoPosition(photo_size);
				this.shownCells.push(photo_pos);
			}
		}
	}

	addCells(cells) {
		this.cells.push(...cells);
		for (const cell of cells) {
			if (cell.type.startsWith('image') || cell.type.startsWith('video')) {
				const photo = cell.media;
				const photo_size = calculatePhotoSize(photo);
				const photo_pos = calculatePhotoPosition(photo_size);
				this.shownCells.push(photo_pos);
			}
		}
	}
}

export const branch = new Branch();
