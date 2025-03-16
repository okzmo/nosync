import { backdrop } from './backdrop.svelte';
import { branch } from './branch.svelte';
import { cell } from './cell.svelte';
import { sidebar } from './sidebar.svelte';
import { space } from './space.svelte';

class Menu {
	open = $state(false);

	init() {
		document.addEventListener('keydown', (e) => {
			const { key, ctrlKey, metaKey } = e;

			switch (key) {
				case (ctrlKey || metaKey) && 'k':
					e.preventDefault();
					sidebar.close();
					this.toggleMenu();
					break;
				case 'Escape':
					e.preventDefault();

					if (space.changingSpace) {
						space.changingSpace = false;
						return;
					}

					if (branch.changingBranch) {
						branch.changingBranch = false;
						return;
					}

					this.closeMenu();
					sidebar.close();
					sidebar.isFocused = false;
					cell.maximized = undefined;
					setTimeout(() => {
						cell.active = undefined;
						cell.activeIdx = -1;
					}, 250);

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
