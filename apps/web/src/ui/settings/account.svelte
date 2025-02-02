<script lang="ts">
	import { goto } from '$app/navigation';
	import { tuyau } from '$lib/api';
	import { auth } from '$lib/stores/auth.svelte';

	async function onLogout() {
		const { error } = await tuyau.v1.auth.logout.$post();
		if (error) {
			console.error(error);
		}
		goto('/signin');
	}
</script>

<div class="flex flex-col gap-y-6">
	<form class="mt-4">
		<div class="flex justify-between border-t border-t-zinc-50/20 pt-4">
			<div class="flex w-1/2 flex-col">
				<p class="text-lg leading-none">Email</p>
			</div>
			<input
				type="text"
				placeholder="email"
				value={auth.user!.email}
				class="w-1/2 border border-zinc-50/20 bg-transparent placeholder:text-zinc-50/40"
			/>
		</div>
	</form>
	<div class="flex justify-between border-t border-t-zinc-50/20 pt-4">
		<div class="flex w-1/2 flex-col">
			<p class="text-lg leading-none">Logout</p>
		</div>
		<button class="bg-red-500 px-4 py-2 font-semibold text-zinc-50" onclick={onLogout}
			>Logout</button
		>
	</div>
</div>
