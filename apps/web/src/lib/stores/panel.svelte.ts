import { Editor } from '@tiptap/core';

class Panel {
	isOpen = $state(false);
	isFullscreen = $state(false);
	editor = $state<Editor | undefined>();
	editorFocusmode = $state<Editor | undefined>();

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

	focusEditor() {
		this.editor?.commands.focus();
	}
}

export const panel = new Panel();
