import { goto } from '$app/navigation';
import { tuyau } from '$lib/api';
import type { SpaceForm } from '$lib/schemas/space';
import { auth } from './auth.svelte';

class Space {

  async create(space: SpaceForm) {
    const response = await tuyau.v1.space.create.$post(space);
    if (response.status > 300) {
      return { status: 'error.space.create', message: response.error.value.message };
    }

    return { status: "success" }
  }


  goto_first_space() {
    const first_space = auth.user?.spaces[0].name.toLowerCase()
    goto(`/s/${first_space}`)
  }

  has(spaceName: string) {
    const f = auth.user?.spaces.find(space => space.name.toLowerCase() === spaceName)
    return f;
  }
}

export const space = new Space();
