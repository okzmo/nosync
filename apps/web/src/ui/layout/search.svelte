<script lang="ts">
	import { tuyau } from '$lib/api';
	import { branch } from '$lib/stores/branch.svelte';
	import { menu } from '$lib/stores/menu.svelte';
	import { space } from '$lib/stores/space.svelte';
	import { fade } from 'svelte/transition';

	let input = $state<HTMLInputElement | null>(null);
	let inputValue = $state('');

	async function handleInput(e) {
		if (!input || input !== document.activeElement) return;

		const { data, error } = await tuyau.v1.branch.search_cells.$post({
			branchId: space.currentBranch!.id,
			query: inputValue || ''
		});

		if (error) {
			console.error(error);
		}

		branch.cells = data;
	}

	$effect(() => {
		if (menu.open) {
			input?.focus();
		}
	});
</script>

<div class="fixed bottom-0 z-[999] w-full">
	{#if menu.open}
		<input
			bind:this={input}
			bind:value={inputValue}
			oninput={handleInput}
			type="text"
			placeholder="Search"
			class="relative z-[1] w-full border-none bg-transparent px-14 pb-8 font-serif text-5xl italic leading-none text-zinc-50 placeholder:text-zinc-50/30 focus:outline-none focus:ring-0"
			transition:fade={{ duration: 75 }}
		/>
	{/if}
	<div class="progressive-blur down pointer-events-none opacity-0" class:active={menu.open}></div>
</div>

<style lang="postcss">
	.active {
		opacity: 100%;
	}

	.progressive-blur.down {
		transition: opacity 200ms cubic-bezier(0, 0.55, 0.45, 1);
		position: absolute;
		bottom: 0;
		left: 0;
		mask-image: linear-gradient(
			0deg,
			#fafafa 5%,
			rgba(250, 250, 250, 0.93) 30%,
			rgba(250, 250, 250, 0.78) 50%,
			rgba(250, 250, 250, 0.52) 75%,
			rgba(250, 250, 250, 0) 100%
		);
	}
</style>
