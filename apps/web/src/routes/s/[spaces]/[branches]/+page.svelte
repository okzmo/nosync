<script lang="ts">
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { branch } from '$lib/stores/branch.svelte';
	import Dropzone from '../../../../ui/space/dropzone.svelte';
	import { onMount } from 'svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import Media from '../../../../ui/cells/media.svelte';
	import Note from '../../../../ui/cells/note.svelte';

	onMount(async () => {
		branch.cells = await branch.getCells();
		branch.processCells(branch.cells);

		window.addEventListener('resize', () => branch.processCells(branch.cells));
	});

	$effect(() => {
		if (!backdrop.blur) {
			branch.activeCellIdx = -1;
			panel.close();
		}
	});
</script>

<Dropzone />

<div class="relative h-[calc(100vh-1rem)] w-screen overflow-auto p-4">
	{#if branch.shownCells.length > 0}
		{#each branch.shownCells as cell, i}
			{#if cell.type === 'media'}
				<Media photo={cell} {i} />
			{:else if cell.type === 'note'}
				<Note />
			{/if}
		{/each}
	{:else}
		<p>You didn't add anything yet!</p>
	{/if}
</div>
