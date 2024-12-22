import { tuyau } from '$lib/api';
import type { TNote, TPhoto } from '$lib/types/space';
import { calculatePhotoPosition, calculatePhotoSize, columnHeights } from '$lib/utils/gallery';
import { space } from './space.svelte';

class Branch {
	cells = $state<TPhoto[]>([]);
	activeCellIdx = $state(-1);
	activeCell = $state<TPhoto | undefined>();
	cellWrapper = $state<HTMLDivElement | null>();

	async getCells() {
		const { data } = await tuyau.v1.branch({ branchId: '' + space.currentBranch?.id }).$get();

		return data;
	}

	processCells(cells): TPhoto[] {
		if (!cells) return [];
		columnHeights.fill(0);
		const processedCells = [];

		for (const cell of cells) {
			if (cell.type.startsWith('image') || cell.type.startsWith('video')) {
				const photo_size = calculatePhotoSize(cell);
				const photo_pos = calculatePhotoPosition(photo_size);
				processedCells.push(photo_pos);
			}
		}

		return processedCells;
	}

	addCells(cells) {
		if (!cells) return [];
		this.cells.push(...cells);
	}
}

export const branch = new Branch();
