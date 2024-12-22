// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { TUser } from '$lib/types/user';
import 'unplugin-icons/types/svelte';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: TUser | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
