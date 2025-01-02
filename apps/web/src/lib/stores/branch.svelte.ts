import { tuyau } from '$lib/api';
import { transmit } from '$lib/api/transmit';
import type { TCell, TDefault, TNote, TPhoto } from '$lib/types/space';
import {
	calculateCellPosition,
	calculateNoteSize,
	calculatePhotoPosition,
	calculatePhotoSize,
	columnHeights
} from '$lib/utils/gallery';
import { Subscription } from '@adonisjs/transmit-client';
import { global, GUTTER } from './global.svelte';
import { space } from './space.svelte';

class Branch {
	cells = $state<TCell[] | undefined>();
	cellWrapper = $state<HTMLDivElement | null>();
	branchChannel = $state<Subscription | undefined>();
	changingBranch = $state(false);

	async initializeTransmit() {
		branch.branchChannel = transmit.subscription(`branch/${space.currentBranch?.id}`);
		await branch.branchChannel.create();

		branch.branchChannel.onMessage((data) => {
			switch (data.type) {
				case 'branch:updateUploadedImage':
					this.updateImageCell(data);
					break;
			}
		});
	}

	addCells(cells: any) {
		if (!this.cells) return;
		if (!cells) return [];
		this.cells.push(...cells);
	}

	updateImageCell(data: any) {
		if (!this.cells) return;
		const idx = this.cells.findIndex((c) => c.id === data.cellId);
		this.cells[idx].tags = data.tags;
		this.cells[idx].media.url = data.imageUrl;
	}

	processCells(cells: any): Array<TPhoto | TNote | TDefault> {
		if (!cells) return [];
		columnHeights.fill(0);
		const processedCells = [];

		const mainCell: TDefault = {
			id: -1,
			type: 'default',
			width: Math.floor(global.colWidth),
			height: Math.floor(global.colWidth),
			x: 0,
			y: 0
		};
		processedCells.push(mainCell);
		columnHeights[0] += mainCell.height + GUTTER;

		for (const cell of cells) {
			if (cell.type.startsWith('image') || cell.type.startsWith('video')) {
				const photo_size = calculatePhotoSize(cell);
				const photo_pos = calculatePhotoPosition(photo_size);
				processedCells.push(photo_pos);
			} else if (cell.type.startsWith('note')) {
				const note_size = calculateNoteSize(cell);
				const note_pos = calculateCellPosition(note_size);
				processedCells.push(note_pos);
			}
		}

		return processedCells;
	}
}

export const branch = new Branch();
