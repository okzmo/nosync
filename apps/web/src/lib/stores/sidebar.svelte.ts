import { Editor } from '@tiptap/core';

class Sidebar {
	isOpen = $state(false);
	isFocused = $state(false);
	editor = $state<Editor | undefined>();
	editorFocusmode = $state<Editor | undefined>();

	open = () => {
		this.isOpen = true;
	};

	close = () => {
		this.isOpen = false;
	};

	toggleFocusMode = () => {
		this.isFocused = !this.isFocused;
	};

	shrink = () => {
		this.isFocused = false;
	};

	focusEditor() {
		this.editor?.commands.focus();
	}
}

export const sidebar = new Sidebar();
