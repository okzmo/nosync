import { branch } from './branch.svelte';
import { COMMANDS } from '$lib/constants/commands';
import { space } from './space.svelte';
import { tuyau } from '$lib/api';
import type { ApiCell } from '$lib/types/api';

class Search {
  activeCommand = $state<(typeof COMMANDS)[number]>();
  placeholder = $state('Search');
  effect = $state(false);
  value = $state('');

  async cells() {
    const { data, error } = await tuyau.v1.branch.search_cells.$post({
      branchId: space.currentBranch!.id,
      query: search.value.trim()
    });

    if (error) {
      console.error(error);
    }

    return data as ApiCell[];
  }

  async global() {
    if (search.value.trim() === "") return [];

    const { data, error } = await tuyau.v1.branch.global_search_cells.$post({
      query: search.value.trim()
    });

    if (error) {
      console.error(error);
    }

    return data as ApiCell[];
  }

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
