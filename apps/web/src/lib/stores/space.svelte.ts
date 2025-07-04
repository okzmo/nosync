import { tuyau } from '$lib/api';
import type { TBranch, TSpace } from '$lib/types/space';
import { auth } from './auth.svelte';
import { goto } from '$app/navigation';
import { branch } from './branch.svelte';
import { mainStore } from './mainStore.svelte';
import { spaceCreation } from '$lib/schemas/space';

class Space {
  changingSpace = $state(false);
  currentSpace = $state<TSpace | undefined>();
  currentBranch = $state<TBranch | undefined>();

  async create(spaceName: string) {
    const validSpace = spaceCreation.parse({ name: spaceName })

    const existingSpace = auth.user?.spaces.find(
      (space) => space.name.toLowerCase() === validSpace.name.toLowerCase()
    );
    if (existingSpace) {
      await space.goto(existingSpace);
      space.changingSpace = false;
      branch.cells = undefined;

      return;
    }

    const { data, error } = await tuyau.v1.space.create.$post({ name: validSpace.name });

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

  async rename(spaceName: string) {
    if (!this.currentSpace) return;
    const validSpace = spaceCreation.parse({ name: spaceName })

    const existingSpace = auth.user?.spaces.find(
      (space) => space.name.toLowerCase() === validSpace.name.toLowerCase()
    );
    if (existingSpace) {
      //TODO: Add toast error for already existing space with the same name
      this.changingSpace = false;
      return;
    }

    const oldName = this.currentSpace.name;
    const spaceToChange = auth.user!.spaces.findIndex(
      (space) => space.id === this.currentSpace!.id
    );

    if (spaceToChange > -1) {
      auth.user!.spaces[spaceToChange].name = validSpace.name;
    }

    const { error } = await tuyau.v1.space.rename.$post({
      spaceId: this.currentSpace.id,
      name: validSpace.name
    });

    if (error) {
      //TODO: Add toast error to explain why it got renamed back to original
      console.error(error);
      auth.user!.spaces[spaceToChange].name = oldName;
    }

    await space.goto(auth.user!.spaces[spaceToChange]);
    space.changingSpace = false;
  }

  async delete() {
    if (!this.currentSpace) return;

    if (this.currentSpace.id === auth.user!.spaces[0].id) {
      //TODO: Add toast error to explain you can't delete your first ever created space
      return;
    }

    const { error } = await tuyau.v1.space.delete.$post({ spaceId: this.currentSpace.id });

    if (error) {
      //TODO: Add toast error to explain why the deletion wasn't successful
      console.error(error);
    }

    await space.goto(auth.user!.spaces[0]);
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
      goto(`/${space.name.toLowerCase()}/${first_branch.name.toLowerCase()}`);
      mainStore.subscribeTo(space.id, first_branch.id);
    } else {
      this.currentBranch = branch;
      goto(`/${space.name.toLowerCase()}/${branch.name.toLowerCase()}`);
      mainStore.subscribeTo(space.id, branch.id);
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
