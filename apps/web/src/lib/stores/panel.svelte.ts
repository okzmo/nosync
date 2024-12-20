import { backdrop } from './backdrop.svelte';

class Panel {
	isOpen = $state(false);
	isFullscreen = $state(false);

	open = () => {
		this.isOpen = true;
	};

	close = () => {
		this.isOpen = false;
	};

	toggleFullscreen = () => {
		this.isFullscreen = !this.isFullscreen;
	};

	shrink = () => {
		this.isFullscreen = false;
	};
}

export const panel = new Panel();
