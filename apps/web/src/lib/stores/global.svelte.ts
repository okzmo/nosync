export const PADDING = 16;
export const GUTTER = 14;
const MEDIA_COLUMNS: Record<number, number> = {
	768: 2,
	1024: 3,
	1280: 4,
	1512: 5
};

class Global {
	nbColumns = $state(MEDIA_COLUMNS[1512]);
	colWidth = $state(0);
	ready = $derived(this.colWidth > 0);
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
			} else if (window.innerWidth > 1512) {
				this.nbColumns = MEDIA_COLUMNS[1512];
			}
		}
	}

	getColWidth() {
		this.colWidth =
			(window.innerWidth - PADDING * 2 - GUTTER * (this.nbColumns - 1)) / this.nbColumns;
	}
}

export const global = new Global();
