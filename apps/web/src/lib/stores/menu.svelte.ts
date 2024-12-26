import { backdrop } from './backdrop.svelte';
import { panel } from './panel.svelte';

class Menu {
	open = $state(false);

	init() {
		document.addEventListener('keydown', (e) => {
			const { key, ctrlKey, metaKey } = e;

			switch (key) {
				case (ctrlKey || metaKey) && 'k':
					e.preventDefault();
					this.toggleMenu();
					break;
				case 'Escape':
					e.preventDefault();
					this.closeMenu();
					panel.shrink();
					break;
			}
		});
	}

	toggleMenu() {
		if (this.open) {
			this.open = false;
			backdrop.setBlur(false);
			backdrop.set(false);
		} else {
			this.open = true;
			backdrop.setBlur(false);
			backdrop.set(true);
		}
	}

	closeMenu() {
		this.open = false;
		backdrop.setBlur(false);
		backdrop.set(false);
	}
}

export const menu = new Menu();
