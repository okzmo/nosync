import { tuyau } from '$lib/api';
import type { TDefault, TNote, TPhoto, TVideo } from '$lib/types/space';
import {
	calculateCellPosition,
	calculateNoteSize,
	calculatePhotoSize,
	calculateVideoSize
} from '$lib/utils/gallery';
import { Subscription } from '@adonisjs/transmit-client';
import { mainStore, GUTTER } from './mainStore.svelte';
import { space } from './space.svelte';
import { auth } from './auth.svelte';
import type { ApiCell } from '$lib/types/api';

class Branch {
	cells = $state<ApiCell[] | undefined>();
	searchCells = $state<ApiCell[] | undefined>();
	shownCells = $derived.by<ApiCell[] | undefined>(() => {
		if (this.searchCells && this.searchCells.length > 0) {
			return this.searchCells;
		} else if (this.cells && this.cells.length > 0) {
			return this.cells;
		} else {
			return [];
		}
	});
	cellWrapper = $state<HTMLDivElement | null>();
	branchChannel = $state<Subscription | undefined>();
	changingBranch = $state(false);

	addCells(cells: ApiCell[]) {
		if (!this.cells) return;
		if (!cells) return [];
		this.cells.push(...cells);
	}

	updateCells(cells: ApiCell[]) {
		if (!this.cells) return;
		if (!cells) return [];

		for (const cell of cells) {
			const cellToUpdate = this.cells.findIndex((c) => c.id === cell.id);
			if (cellToUpdate !== -1) {
				this.cells[cellToUpdate] = {
					...cell,
					tags: this.cells[cellToUpdate].tags,
					media: {
						...cell.media,
						resizedUrl: this.cells[cellToUpdate].media.resizedUrl,
						originalUrl: this.cells[cellToUpdate].media.originalUrl
					}
				};
			}
		}
	}

	processCells(cells: ApiCell[] | undefined): Array<TPhoto | TNote | TVideo | TDefault> {
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
			if (cell.type.startsWith('image')) {
				const photo_size = calculatePhotoSize(cell);
				const photo_pos = calculateCellPosition(photo_size);
				processedCells.push(photo_pos);
			} else if (cell.type.startsWith('video')) {
				const video_size = calculateVideoSize(cell);
				const video_pos = calculateCellPosition(video_size);
				processedCells.push(video_pos);
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
			this.changingBranch = false;
			this.cells = undefined;

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
		this.changingBranch = false;
		this.cells = undefined;
	}
}

export const branch = new Branch();
