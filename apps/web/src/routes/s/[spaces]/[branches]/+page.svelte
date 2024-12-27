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
	import SolarAddCircleBoldDuotone from '~icons/solar/add-circle-bold-duotone';

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
				<button
					aria-label="Create a cell"
					class="group absolute flex items-center justify-center rounded-2xl border border-zinc-50/10 bg-zinc-900 transition-colors hover:border-zinc-50/30 active:border-zinc-50/20"
					style="height: {cell.height}px; width: {cell.width}px; transform: translate({cell.x}px, {cell.y}px);"
				>
					<SolarAddCircleBoldDuotone
						height={96}
						width={96}
						class="text-zinc-50/20 transition-colors group-hover:text-zinc-50/40 group-active:text-zinc-50/30"
					/>
				</button>
			{/if}
		{/each}
	{:else}
		<p>You didn't add anything yet!</p>
	{/if}
</div>
