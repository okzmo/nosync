import { tuyau } from '$lib/api';
import type { TCell, TNote, TPhoto } from '$lib/types/space';
import { space } from './space.svelte';
import { branch } from './branch.svelte';
import type { JSONContent } from '@tiptap/core';
import { panel } from './panel.svelte';
import { backdrop } from './backdrop.svelte';

class Cell {
	active = $state<TPhoto | TNote | undefined>();
	activeIdx = $state(-1);

	async saveTitle(title: string) {
		if (!this.active) return;
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
		if (!this.active) return;
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
		cell.active = { type: 'note' };
		cell.activeIdx = branch.cells.length;
		backdrop.open();
		panel.open();

		const { data, error } = await tuyau.v1.cell.create_note.$post({
			branchId: space.currentBranch?.id
		});
		console.log(data);

		if (error) {
			console.error(error);
			branch.cells.pop();
			backdrop.close();
			panel.close();
			return;
		}

		branch.cells.push(data);
		cell.active = data;
	}

	async delete(cellId: number, idx: number) {
		const removed = branch.cells.splice(idx, 1);

		const { error } = await tuyau.v1.cell.delete_cell.$delete({
			id: cellId,
			branchId: space.currentBranch?.id
		});

		// TODO: Add toast error if deletion impossible
		if (error) {
			branch.cells.splice(idx, 0, removed[0]);
			console.error(error);
			return;
		}
	}
}

export const cell = new Cell();
