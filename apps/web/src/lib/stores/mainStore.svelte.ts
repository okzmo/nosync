import { Transmit } from '@adonisjs/transmit-client';
import { branch } from './branch.svelte';
import type { TransmitMessages } from '$lib/types/api';
import { auth } from './auth.svelte';
import { cell } from './cell.svelte';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker';
import { space } from './space.svelte';

export const PADDING = 16;
export const GUTTER = 14;
export const SIDEBAR_WIDTH = 415;
const MEDIA_COLUMNS: Record<number, number> = {
	768: 2,
	1024: 3,
	1280: 5,
	1512: 6,
	1513: 7
};

class MainStore {
	nbColumns = $state(MEDIA_COLUMNS[1513]);
	columnHeights = $derived(Array(mainStore.nbColumns).fill(0));
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
			baseUrl: import.meta.env.VITE_API_URL
		});
		this.transmit = transmitConn;

		if (space.currentBranch && space.currentSpace) {
			mainStore.subscribeTo(space.currentSpace.id, space.currentBranch.id);
		}
	}

	setupPDFWorker() {
		pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();
	}

	async subscribeTo(spaceId: number, branchId: number) {
		if (!this.transmit) return;
		if (branch.branchChannel) {
			branch.stopListeningToBranch();
			branch.stopListeningToBranch = undefined;
			await branch.branchChannel.delete();
		}

		branch.branchChannel = this.transmit.subscription(
			`user/${auth.user?.id}/space/${spaceId}/branch/${branchId}`
		);
		await branch.branchChannel.create();

		branch.stopListeningToBranch = branch.branchChannel.onMessage((data: TransmitMessages) => {
			switch (data.type) {
				case 'branch:finishTagsCreation':
					cell.updateTags(data);
					break;
				case 'branch:finishBlurredImageUpload':
					cell.updateBlurImage(data);
					break;
				case 'branch:finishBlurredThumbnailVideoUpload':
					cell.updateBlurImage(data);
					break;
				case 'branch:finishResizedImageUpload':
					cell.updateResizedImage(data);
					break;
				case 'branch:finishOriginalImageUpload':
					cell.updateOriginalUrl(data);
					break;
				case 'branch:finishThumbnailVideoUpload':
					cell.updateThumbnail(data);
					break;
				case 'branch:finishOriginalVideoUpload':
					cell.updateOriginalUrl(data);
					break;
				case 'branch:finishOriginalFileUpload':
					cell.updateOriginalUrl(data);
					break;
				case 'branch:cellFromExtensionCreated':
					cell.addCellFromExtension(data);
					break;
			}
		});
	}
}

export const mainStore = new MainStore();
