import { cell } from './cell.svelte';

class Backdrop {
	active = $state(false);
	blur = $state(false);

	setBlur(value: boolean) {
		this.blur = value;
	}

	set(value: boolean) {
		this.active = value;
	}

	open() {
		this.active = true;
		this.blur = true;
	}

	close() {
		this.active = false;
		this.blur = false;
		cell.maximized = undefined;
	}
}

export const backdrop = new Backdrop();
