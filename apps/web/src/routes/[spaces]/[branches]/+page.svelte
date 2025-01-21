<script lang="ts">
	import { tuyau } from '$lib/api';
	import { branch } from '$lib/stores/branch.svelte';
	import { mainStore } from '$lib/stores/mainStore.svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import { space } from '$lib/stores/space.svelte';
	import type { ApiCell } from '$lib/types/api';
	import { onDestroy, onMount } from 'svelte';
	import Dropzone from 'ui/branch/dropzone.svelte';
	import MaximizeZone from 'ui/branch/maximize-zone.svelte';
	import MainButton from 'ui/cells/main-button.svelte';
	import Media from 'ui/cells/media.svelte';
	import Note from 'ui/cells/note.svelte';
	import Sidebar from 'ui/sidebar/sidebar.svelte';

	const shownCells = $derived.by(async () => {
		if (!mainStore.ready) return [];

		if (!branch.cells) {
			const { data, error } = await tuyau.v1.branch
				.cells({ branchId: '' + space.currentBranch?.id })
				.$get();

			if (error) {
				console.error(error);
			}
			console.log(data);

			branch.cells = data as ApiCell[];
		}

		return branch.processCells(branch.cells);
	});

	onMount(async () => {
		window.addEventListener('resize', () => branch.processCells(branch.cells));
	});

	onDestroy(() => {
		window.removeEventListener('resize', () => branch.processCells(branch.cells));
	});
</script>

<Dropzone />
<MaximizeZone />

<div
	class="transition-container flex h-screen w-[calc(100%+415px)] -translate-x-[415px]"
	class:translate-x-0={panel.isOpen}
	bind:this={branch.cellWrapper}
>
	<div class="relative h-full w-[415px] pt-4">
		<Sidebar />
	</div>
	<div class="relative h-full w-screen p-4">
		{#await shownCells then cells}
			{#if cells.length > 0}
				{#each cells as cell, i}
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
		{/await}
	</div>
</div>

<style>
	.transition-container {
		transition: transform 350ms cubic-bezier(0.625, 0.05, 0, 1);
	}
</style>
