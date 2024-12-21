import { tuyau } from '$lib/api';
import type { TNote, TPhoto } from '$lib/types/space';
import { calculatePhotoPosition, calculatePhotoSize, columnHeights } from '$lib/utils/gallery';
import { space } from './space.svelte';

class Branch {
	cells = $state<TPhoto[]>([]);
	shownCells = $state<Array<TPhoto | TNote>>([]);
	activeCellIdx = $state(-1);
	activeCell = $state<TPhoto | undefined>();
	cellWrapper = $state<HTMLDivElement | null>();

	async getCells() {
		const { data } = await tuyau.v1.branch({ branchId: '' + space.currentBranch?.id }).$get();

		return data;
	}

	processCells(cells) {
		if (!cells) return;
		columnHeights.fill(0);
		this.shownCells = [];

		for (const cell of cells) {
			if (cell.type.startsWith('image') || cell.type.startsWith('video')) {
				const photo_size = calculatePhotoSize(cell);
				const photo_pos = calculatePhotoPosition(photo_size);
				this.shownCells.push(photo_pos);
			}
		}
	}

	addCells(cells) {
		if (!cells) return;
		this.cells.push(...cells);

		for (const cell of cells) {
			if (cell.type.startsWith('image') || cell.type.startsWith('video')) {
				const photo_size = calculatePhotoSize(cell);
				const photo_pos = calculatePhotoPosition(photo_size);
				this.shownCells.push(photo_pos);
			}
		}
	}
}

export const branch = new Branch();
