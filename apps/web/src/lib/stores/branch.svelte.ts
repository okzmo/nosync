import { tuyau } from '$lib/api';
import type { TDefault, TNote, TPhoto } from '$lib/types/space';
import { calculateCellPosition, calculateNoteSize, calculatePhotoSize } from '$lib/utils/gallery';
import { Subscription } from '@adonisjs/transmit-client';
import { mainStore, GUTTER } from './mainStore.svelte';
import { space } from './space.svelte';
import { auth } from './auth.svelte';
import type { ApiCell, TransmitUpdateImage } from '$lib/types/api';

class Branch {
	cells = $state<ApiCell[] | undefined>();
	cellWrapper = $state<HTMLDivElement | null>();
	branchChannel = $state<Subscription | undefined>();
	changingBranch = $state(false);

	addCells(cells: ApiCell[]) {
		if (!this.cells) return;
		if (!cells) return [];
		this.cells.push(...cells);
	}

	updateImageCell(data: TransmitUpdateImage) {
		if (!this.cells) return;
		const idx = this.cells.findIndex((c) => c.id === data.cellId);
		this.cells[idx].tags = data.tags;
		this.cells[idx].media.url = data.imageUrl;
	}

	processCells(cells: ApiCell[] | undefined): Array<TPhoto | TNote | TDefault> {
		if (!cells) return [];
		mainStore.columnHeights.fill(0);
		const processedCells = [];

		const mainCell: TDefault = {
			id: -1,
			type: 'default',
			width: Math.floor(mainStore.colWidth),
			height: Math.floor(mainStore.colWidth),
			x: 0,
			y: 0
		};
		processedCells.push(mainCell);
		mainStore.columnHeights[0] += mainCell.height + GUTTER;

		for (const cell of cells) {
			if (cell.type.startsWith('image') || cell.type.startsWith('video')) {
				const photo_size = calculatePhotoSize(cell);
				const photo_pos = calculateCellPosition(photo_size);
				processedCells.push(photo_pos);
			} else if (cell.type.startsWith('note')) {
				const note_size = calculateNoteSize(cell);
				const note_pos = calculateCellPosition(note_size);
				processedCells.push(note_pos);
			}
		}

		if (branch.cellWrapper) {
			branch.cellWrapper.style.height = Math.max(...mainStore.columnHeights) + 18 + 'px';
		}

		return processedCells;
	}

	async create(branchName: string) {
		const existingBranch = space.currentSpace!.branches.find(
			(branch) => branch.name === branchName
		);
		if (existingBranch) {
			await space.goto(space.currentSpace!, existingBranch);
			branch.changingBranch = false;
			branch.cells = undefined;

			return;
		}

		const { data, error } = await tuyau.v1.branch.create.$post({
			branchName: branchName,
			spaceId: space.currentSpace!.id
		});

		// TODO: Add toast error if creation impossible
		if (error) {
			console.error(error);
			return;
		}

		const spaceIdx = auth.user?.spaces.findIndex((s) => s.id === space.currentSpace!.id);
		auth.user?.spaces[spaceIdx!].branches.push(data);

		await space.goto(space.currentSpace!, data);
		branch.changingBranch = false;
		branch.cells = undefined;
	}
}

export const branch = new Branch();
