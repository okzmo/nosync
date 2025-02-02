<script lang="ts">
	import { goto } from '$app/navigation';
	import { tuyau } from '$lib/api';
	import ChangeEmail from './changeEmail.svelte';

	let successMessage = $state('');

	async function onLogout() {
		const { error } = await tuyau.v1.auth.logout.$post();
		if (error) {
			console.error(error);
		}
		goto('/signin');
	}
</script>

{#if successMessage !== ''}
	<span
		class="mt-4 flex w-full items-center justify-center border border-green-500 py-2 text-green-500"
	>
		{successMessage}
	</span>
{/if}

<div class="flex flex-col gap-y-6">
	<ChangeEmail bind:successMessage />
	<div class="flex justify-between border-t border-t-zinc-50/20 pt-4">
		<div class="flex w-1/2 flex-col">
			<p class="text-lg leading-none">Logout</p>
		</div>
		<button class="bg-red-500 px-4 py-2 font-semibold text-zinc-50" onclick={onLogout}
			>Logout</button
		>
	</div>
</div>
