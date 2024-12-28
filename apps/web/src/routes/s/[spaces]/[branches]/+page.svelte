<script lang="ts">
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { branch } from '$lib/stores/branch.svelte';
	import Dropzone from '../../../../ui/space/dropzone.svelte';
	import { onMount } from 'svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import Media from '../../../../ui/cells/media.svelte';
	import Note from '../../../../ui/cells/note.svelte';
	import { global } from '$lib/stores/global.svelte';
	import { tuyau } from '$lib/api';
	import { space } from '$lib/stores/space.svelte';
	import { cell } from '$lib/stores/cell.svelte';
	import MainButton from '../../../../ui/cells/main-button.svelte';

	const shownCells = $derived.by(() => {
		if (!global.ready) return [];
		return branch.processCells(branch.cells);
	});

	onMount(async () => {
		const { data, error } = await tuyau.v1
			.branch({ branchId: '' + space.currentBranch?.id })
			.$get();

		if (error) {
			console.error(error);
		}

		branch.cells = data;

		window.addEventListener('resize', () => branch.processCells(branch.cells));
	});

	$effect(() => {
		if (!backdrop.blur) {
			panel.close();

			setTimeout(() => {
				cell.active = undefined;
				cell.activeIdx = -1;
			}, 150);
		}
	});
</script>

<Dropzone />

<div class="relative h-screen w-screen overflow-auto p-4" bind:this={branch.cellWrapper}>
	{#if shownCells.length > 0}
		{#each shownCells as cell, i}
			{#if cell.type === 'media'}
				<Media photo={cell} i={i - 1} />
			{:else if cell.type === 'note'}
				<Note note={cell} i={i - 1} />
			{:else if cell.type === 'default'}
				<MainButton main={cell} />
			{/if}
		{/each}
	{:else}
		<p>You didn't add anything yet!</p>
	{/if}
</div>
