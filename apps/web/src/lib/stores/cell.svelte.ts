import { tuyau } from '$lib/api';
import type { TNote, TPDF, TPhoto, TVideo } from '$lib/types/space';
import type { JSONContent } from '@tiptap/core';
import { branch } from './branch.svelte';
import { space } from './space.svelte';
import type {
	TransmitAddCellFromExtension,
	TransmitUpdateBlurImage,
	TransmitUpdateOriginal,
	TransmitUpdateResizedImage,
	TransmitUpdateTags,
	TransmitUpdateThumbnail
} from '$lib/types/api';

class Cell {
	active = $state<TPhoto | TNote | TVideo | TPDF | undefined>();
	activeIdx = $state(-1);
	maximized = $state<TPhoto | TVideo | TPDF | undefined>();

	updateBlurImage(data: TransmitUpdateBlurImage) {
		if (!branch.cells) return;
		const idx = branch.cells.findIndex((c) => c.id === data.cellId);
		if (idx !== -1) {
			branch.cells[idx].media.blurUrl = data.blurUrl;
		}
	}

	updateResizedImage(data: TransmitUpdateResizedImage) {
		if (!branch.cells) return;
		const idx = branch.cells.findIndex((c) => c.id === data.cellId);
		if (idx !== -1) {
			branch.cells[idx].media.resizedUrl = data.resizedUrl;
		}
	}

	updateOriginalUrl(data: TransmitUpdateOriginal) {
		if (!branch.cells) return;
		const idx = branch.cells.findIndex((c) => c.id === data.cellId);
		if (idx !== -1) {
			branch.cells[idx].media.originalUrl = data.originalUrl;
		}
	}

	addCellFromExtension(data: TransmitAddCellFromExtension) {
		if (!branch.cells) return;
		branch.cells.push(data.cell);
	}

	updateTags(data: TransmitUpdateTags) {
		if (!branch.cells) return;
		const idx = branch.cells.findIndex((c) => c.id === data.cellId);
		if (idx !== -1) {
			branch.cells[idx].tags = data.tags;
		}
	}

	updateThumbnail(data: TransmitUpdateThumbnail) {
		if (!branch.cells) return;
		const idx = branch.cells.findIndex((c) => c.id === data.cellId);
		if (idx !== -1) {
			branch.cells[idx].media.thumbnailUrl = data.thumbnailUrl;
		}
	}

	async saveTitle(title: string) {
		if (!this.active || !branch.cells) return;
		if (branch.cells[this.activeIdx].title === title) return;

		if (cell.active) cell.active.title = title;
		branch.cells[this.activeIdx].title = title;

		const body = {
			id: this.active.id,
			branchId: space.currentBranch?.id,
			title: title
		};

		await tuyau.v1.cell.save_title.$post(body);
	}

	async saveContent(content: JSONContent, searchContent: string) {
		if (!this.active || !branch.cells) return;
		if (branch.cells[this.activeIdx].content === content) return;

		branch.cells[this.activeIdx].content = content;

		const body = {
			id: this.active.id,
			branchId: space.currentBranch?.id,
			content: content,
			searchContent: searchContent
		};

		await tuyau.v1.cell.save_content.$post(body);
	}

	async delete(cellId: string, idx: number) {
		const removed = branch.cells!.splice(idx, 1);

		const { error } = await tuyau.v1.cell.delete_cell.$delete({
			id: cellId,
			branchId: space.currentBranch?.id
		});

		// TODO: Add toast error if deletion impossible
		if (error) {
			branch.cells!.splice(idx, 0, removed[0]);
			console.error(error);
			return;
		}
	}

	async moveTo(cellId: string, cellIdx: number, branchId: number) {
		const moved = branch.cells!.splice(cellIdx, 1);

		const { error } = await tuyau.v1.cell.move_cell.$post({
			id: cellId,
			branchId
		});

		// TODO: Add toast error if move impossible
		if (error) {
			branch.cells!.splice(cellIdx, 0, moved[0]);
			console.error(error);
			return;
		}
	}
}

export const cell = new Cell();
