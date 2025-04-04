import { branch } from './branch.svelte';
import { COMMANDS } from '$lib/constants/commands';
import { space } from './space.svelte';

class Search {
	activeCommand = $state<(typeof COMMANDS)[number]>();
	placeholder = $state('Search');
	effect = $state(false);

	isCommand(query: string) {
		const command = COMMANDS.find((c) => c.type.startsWith(query));
		if (command) {
			this.activeCommand = command;
			this.placeholder = command.placeholder;

			return true;
		}

		return false;
	}

	resetCommand() {
		this.activeCommand = undefined;
		this.placeholder = 'Search';
	}

	launchEffect() {
		this.effect = true;
		setTimeout(() => {
			this.effect = false;
		}, 150);
	}

	executeCommand(input?: string) {
		switch (this.activeCommand?.type) {
			case 'space':
				space.create(input!);
				break;
			case 'branch':
				branch.create(input!);
				break;
			case 'note':
				branch.createNote(input);
				break;
			case 'upload':
				branch.uploadFile(input);
				break;
		}
	}
}

export const search = new Search();
