import { tuyau } from '$lib/api';
import type { TNote, TPhoto, TVideo } from '$lib/types/space';
import type { JSONContent } from '@tiptap/core';
import { backdrop } from './backdrop.svelte';
import { branch } from './branch.svelte';
import { panel } from './panel.svelte';
import { space } from './space.svelte';
import { formatDate } from '$lib/utils/date';
import type {
	TransmitUpdateOriginal,
	TransmitUpdateResizedImage,
	TransmitUpdateTags,
	TransmitUpdateThumbnail
} from '$lib/types/api';

class Cell {
	active = $state<TPhoto | TNote | TVideo | undefined>();
	activeIdx = $state(-1);
	maximized = $state<TPhoto | TVideo | undefined>();

	updateResizedImage(data: TransmitUpdateResizedImage) {
		if (!branch.cells) return;
		const idx = branch.cells.findIndex((c) => c.id === data.cellId);
		branch.cells[idx].media.resizedUrl = data.resizedUrl;
	}

	updateOriginalUrl(data: TransmitUpdateOriginal) {
		if (!branch.cells) return;
		const idx = branch.cells.findIndex((c) => c.id === data.cellId);
		branch.cells[idx].media.originalUrl = data.originalUrl;
	}

	updateTags(data: TransmitUpdateTags) {
		if (!branch.cells) return;
		const idx = branch.cells.findIndex((c) => c.id === data.cellId);
		branch.cells[idx].tags = data.tags;
	}

	updateThumbnail(data: TransmitUpdateThumbnail) {
		if (!branch.cells) return;
		const idx = branch.cells.findIndex((c) => c.id === data.cellId);
		branch.cells[idx].media.thumbnailUrl = data.thumbnailUrl;
	}

	async saveTitle(title: string) {
		if (!this.active || !branch.cells) return;
		if (branch.cells[this.activeIdx].title === title) return;

		branch.cells[this.activeIdx].title = title;

		const body = {
			id: this.active.id,
			branchId: space.currentBranch?.id,
			title: title
		};

		await tuyau.v1.cell.save_title.$post(body);
	}

	async saveContent(content: JSONContent) {
		if (!this.active || !branch.cells) return;
		if (branch.cells[this.activeIdx].content === content) return;

		branch.cells[this.activeIdx].content = content;

		const body = {
			id: this.active.id,
			branchId: space.currentBranch?.id,
			content: content
		};

		await tuyau.v1.cell.save_content.$post(body);
	}

	async createNote() {
		cell.active = { type: 'note', content: null, createdAt: formatDate(new Date().toString()) };
		cell.activeIdx = branch.cells.length;
		panel.open();

		const { data, error } = await tuyau.v1.cell.create_note.$post({
			branchId: space.currentBranch?.id
		});

		if (error) {
			console.error(error);
			if (branch.cells) {
				branch.cells.pop();
			}
			backdrop.close();
			panel.close();
			return;
		}

		if (branch.cells) {
			branch.cells.push(data);
		} else {
			branch.cells = [data];
		}
		cell.active = {
			...data,
			createdAt: formatDate(data.createdAt)
		};
	}

	async delete(cellId: number, idx: number) {
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
}

export const cell = new Cell();
