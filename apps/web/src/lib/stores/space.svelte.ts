import { tuyau } from '$lib/api';
import type { SpaceForm } from '$lib/schemas/space';
import type { TBranch, TSpace } from '$lib/types/space';
import { redirect } from '@sveltejs/kit';
import { auth } from './auth.svelte';
import { goto } from '$app/navigation';

class Space {
	changingSpace = $state(false);
	currentSpace = $state<TSpace | undefined>();
	currentBranch = $state<TBranch | undefined>();

	async create(space: SpaceForm) {
		const response = await tuyau.v1.space.create.$post(space);
		if (response.status > 300) {
			return { status: 'error.space.create', message: response.error.value.message };
		}

		return { status: 'success' };
	}

	goto_first_space() {
		const first_space = auth.user?.spaces[0];
		const first_branch = first_space?.branches[0];
		this.currentSpace = first_space;
		this.currentBranch = first_branch;
		throw redirect(
			303,
			`/s/${first_space!.name.toLowerCase()}/${first_branch?.name.toLowerCase()}`
		);
	}

	async goto(space: TSpace, branch?: TBranch) {
		if (!branch) {
			const first_branch = space.branches[0];
			this.currentBranch = first_branch;
			await goto(`/s/${space.name.toLowerCase()}/${first_branch.name.toLowerCase()}`);
		} else {
			await goto(`/s/${space.name.toLowerCase()}/${branch.name.toLowerCase()}`);
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
