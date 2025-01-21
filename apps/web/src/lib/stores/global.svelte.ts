import { Transmit } from '@adonisjs/transmit-client';
import { branch } from './branch.svelte';
import type { TransmitUpdateImage } from '$lib/types/api';
import { auth } from './auth.svelte';

export const PADDING = 16;
export const GUTTER = 14;
const MEDIA_COLUMNS: Record<number, number> = {
	768: 2,
	1024: 3,
	1280: 4,
	1512: 5,
	1513: 6
};

class Global {
	nbColumns = $state(MEDIA_COLUMNS[1513]);
	colWidth = $state(0);
	ready = $derived(this.colWidth > 0);
	transmit = $state<Transmit>();
	#screenSizes = Object.keys(MEDIA_COLUMNS);

	init() {
		this.getNbColumns();
		this.getColWidth();

		window.addEventListener('resize', () => this.getNbColumns());
		window.addEventListener('resize', () => this.getColWidth());
	}

	getNbColumns() {
		for (const screenSize of this.#screenSizes) {
			const s = Number(screenSize);
			if (window.innerWidth <= s) {
				this.nbColumns = MEDIA_COLUMNS[s];
				break;
			} else if (window.innerWidth > 1513) {
				this.nbColumns = MEDIA_COLUMNS[1513];
			}
		}
	}

	getColWidth() {
		this.colWidth =
			(window.innerWidth - PADDING * 2 - GUTTER * (this.nbColumns - 1)) / this.nbColumns;
	}

	async initializeTransmit() {
		if (!auth.user?.spaces) return;
		const transmitConn = new Transmit({
			baseUrl: 'http://localhost:3333'
		});
		this.transmit = transmitConn;
	}

	async subscribeTo(spaceId: number, branchId: number) {
		if (!this.transmit) return;
		if (branch.branchChannel) {
			await branch.branchChannel.delete();
		}

		branch.branchChannel = this.transmit.subscription(`space:${spaceId}:branch:${branchId}`);
		await branch.branchChannel?.create();

		branch.branchChannel.onMessage((data: TransmitUpdateImage) => {
			switch (data.type) {
				case 'branch:updateUploadedImage':
					branch.updateImageCell(data);
					break;
			}
		});
	}
}

export const global = new Global();
