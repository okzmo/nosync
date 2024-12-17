<script lang="ts">
	import { menu } from '$lib/stores/menu.svelte';
	import { fade } from 'svelte/transition';

	let input = $state<HTMLInputElement | null>(null);

	$effect(() => {
		if (menu.open) {
			input?.focus();
		}
	});
</script>

<div class="fixed bottom-0 w-full">
	{#if menu.open}
		<input
			bind:this={input}
			type="text"
			placeholder="Search"
			class="relative z-[1] w-full border-none bg-transparent px-14 pb-8 font-serif text-5xl italic leading-none text-zinc-50 placeholder:text-zinc-50/30 focus:outline-none focus:ring-0"
			transition:fade={{ duration: 125 }}
		/>
	{/if}
	<div
		class="progressive-blur down pointer-events-none translate-y-full"
		class:active={menu.open}
	></div>
</div>

<style lang="postcss">
	.active {
		transform: translateY(0);
	}

	.progressive-blur.down {
		transition: transform 200ms cubic-bezier(0, 0.55, 0.45, 1);
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