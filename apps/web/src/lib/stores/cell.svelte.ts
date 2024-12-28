import { tuyau } from '$lib/api';
import type { TNote, TPhoto } from '$lib/types/space';
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
		const { data, error } = await tuyau.v1.cell.create_note.$post({
			branchId: space.currentBranch?.id
		});

		if (error) {
			console.error(error);
			return;
		}

		cell.active = data;
		cell.activeIdx = branch.cells.length;
		branch.cells.push(data);
		backdrop.open();
		panel.open();
	}
}

export const cell = new Cell();
