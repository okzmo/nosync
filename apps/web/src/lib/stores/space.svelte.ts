import { tuyau } from '$lib/api';
import type { TBranch, TSpace } from '$lib/types/space';
import { auth } from './auth.svelte';
import { goto } from '$app/navigation';
import { branch } from './branch.svelte';
import { mainStore } from './mainStore.svelte';

class Space {
	changingSpace = $state(false);
	currentSpace = $state<TSpace | undefined>();
	currentBranch = $state<TBranch | undefined>();

	async create(spaceName: string) {
		const existingSpace = auth.user?.spaces.find(
			(space) => space.name.toLowerCase() === spaceName.toLowerCase()
		);
		if (existingSpace) {
			await space.goto(existingSpace);
			space.changingSpace = false;
			branch.cells = undefined;

			return;
		}

		const { data, error } = await tuyau.v1.space.create.$post({ name: spaceName });

		// TODO: Add toast error if creation impossible
		if (error) {
			console.error(error);
			return;
		}

		auth.user?.spaces.push(data);
		await space.goto(data);
		space.changingSpace = false;
		branch.cells = undefined;
	}

	async goto_first_space() {
		const first_space = auth.user?.spaces[0];
		const first_branch = first_space?.branches[0];
		if (!first_branch || !first_space) return;

		this.currentSpace = first_space;
		this.currentBranch = first_branch;
		await mainStore.subscribeTo(first_space.id, first_branch.id);
		return goto(`/${first_space.name.toLocaleLowerCase()}/${first_branch.name.toLowerCase()}`);
	}

	async goto(space: TSpace, branch?: TBranch) {
		if (!branch) {
			const first_branch = space.branches[0];
			this.currentBranch = first_branch;
			await mainStore.subscribeTo(space.id, first_branch.id);
			await goto(`/${space.name.toLowerCase()}/${first_branch.name.toLowerCase()}`);
		} else {
			await mainStore.subscribeTo(space.id, branch.id);
			await goto(`/${space.name.toLowerCase()}/${branch.name.toLowerCase()}`);
		}
	}

	has(spaceName: string, branchName?: string) {
		const space = auth.user?.spaces.find(
			(space) => space.name.toLowerCase() === spaceName.toLowerCase()
		);
		this.currentSpace = space;
		if (!branchName) {
			return { space };
		}

		const branch = space?.branches.find(
			(branch) => branch.name.toLowerCase() === branchName.toLowerCase()
		);
		this.currentBranch = branch;
		return { s: space, b: branch };
	}
}

export const space = new Space();
