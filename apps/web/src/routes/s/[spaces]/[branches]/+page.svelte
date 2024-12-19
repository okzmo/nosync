<script lang="ts">
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { branch } from '$lib/stores/branch.svelte';
	import { twJoin } from 'tailwind-merge';
	import Dropzone from '../../../../ui/space/dropzone.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		branch.cells = await branch.getCells();
		branch.processCells(branch.cells);

		window.addEventListener('resize', () => branch.processCells(branch.cells));
	});

	$effect(() => {
		if (!backdrop.blur) {
			setTimeout(() => {
				branch.activeCell = -1;
			}, 75);
		}
	});
</script>

<Dropzone />

<div class="relative h-[calc(100vh-1rem)] w-screen overflow-auto p-4">
	{#if branch.shownCells.length > 0}
		{#each branch.shownCells as photo, i}
			<button
				onclick={() => {
					branch.activeCell = i;
					backdrop.set(true);
					backdrop.setBlur(true);
				}}
				class={twJoin(
					'absolute overflow-hidden rounded-xl before:absolute before:inset-0 before:content-normal before:rounded-xl before:bg-gradient-to-t before:from-zinc-950/50 before:to-transparent before:opacity-0 before:transition-opacity before:duration-75',
					branch.activeCell === -1 && 'hover:before:opacity-100'
				)}
				class:z-[998]={branch.activeCell === i}
				style="height: {photo.height}px; width: {photo.width}px; transform: translate({photo.x}px, {photo.y}px);"
			>
				<img src={photo.url} alt="" class="h-full w-full object-cover" />
			</button>
		{/each}
	{:else}
		<p>You didn't add anything yet!</p>
	{/if}
</div>
