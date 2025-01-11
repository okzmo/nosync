<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let globalMessage = $state('');

	let { data } = $props();

	onMount(async () => {
		if (!data.isInvalid) {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			goto('/setup');
		}
	});
</script>

{#if globalMessage}
	<p
		class="absolute left-[49.35%] top-[14rem] flex -translate-x-1/2 items-center gap-x-2 rounded-2xl text-center text-green-500"
	>
		{globalMessage}
	</p>
{/if}

<div
	class="absolute left-1/2 top-1/2 flex min-w-[20rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
>
	{#if !data.isInvalid}
		<h2 class="text-center font-serif text-5xl italic text-zinc-700">{data.message}</h2>
	{:else}
		<h2 class="text-center font-serif text-5xl italic text-zinc-700">This link has expired</h2>
		<a class="mt-5 underline" href="/signin">Go back</a>
	{/if}
</div>

<div class="absolute left-5 top-4 flex flex-col font-code">
	<h1 class="uppercase">Breash <span class="text-[#F22E48]">[alpha release]</span></h1>
	<p class="uppercase">
		Version <span class="bg-version bg-clip-text text-transparent">[ocean wave]</span>
	</p>
	<p class="uppercase">State: [verify email]</p>
</div>
