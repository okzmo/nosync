<script lang="ts">
	import { branch } from '$lib/stores/branch.svelte';
	import { cell } from '$lib/stores/cell.svelte';
	import { mainStore } from '$lib/stores/mainStore.svelte';
	import { sidebar } from '$lib/stores/sidebar.svelte';
	import { space } from '$lib/stores/space.svelte';
	import { onDestroy, onMount } from 'svelte';
	import Dropzone from 'ui/branch/dropzone.svelte';
	import MaximizeZone from 'ui/layout/maximize-zone.svelte';
	import FocusMode from 'ui/layout/focus-mode.svelte';
	import MainButton from 'ui/cells/main-button.svelte';
	import Note from 'ui/cells/note.svelte';
	import Pdf from 'ui/cells/pdf.svelte';
	import Photo from 'ui/cells/photo.svelte';
	import Video from 'ui/cells/video.svelte';
	import Sidebar from 'ui/sidebar/sidebar.svelte';
	import { twJoin } from 'tailwind-merge';
	import { search } from '$lib/stores/search.svelte';

	const shownCells = $derived.by(async () => {
		if (!mainStore.ready) return [];
		if (!branch.cells) return [];
		if (search.activeCommand && search.activeCommand.type !== 'global') return branch.cells;

		return branch.filterCells(search.value);
	});

	$effect(() => {
		if (space.currentBranch) {
			branch.getCells();
		}
	});

	onMount(async () => {
		window.addEventListener('resize', () => branch.processCells(branch.cells));
	});

	onDestroy(() => {
		window.removeEventListener('resize', () => branch.processCells(branch.cells));
	});
</script>

<svelte:head>
	<title>
		{cell.active?.title ? `${cell.active?.title} | ` : ''}
		{space.currentSpace?.name} / {space.currentBranch?.name}
	</title>
</svelte:head>

<Dropzone />
<MaximizeZone />
<FocusMode />

<div
	class="transition-container flex h-screen w-[calc(100%+415px)] -translate-x-[415px]"
	class:translate-x-0={sidebar.isOpen}
	bind:this={branch.cellWrapper}
>
	<div class="relative h-full w-[415px] pt-4">
		<Sidebar />
	</div>
	<div
		class={twJoin(
			'relative h-full w-screen p-4 transition-transform delay-300 duration-300',
			sidebar.isFocused ? 'scale-95' : 'scale-100'
		)}
	>
		<MainButton />
		{#await shownCells then cells}
			{@const processedCells = branch.processCells(cells)}
			{#each processedCells as cell, i}
				{#if cell.type === 'photo'}
					<Photo photo={cell} i={i - 1} />
				{:else if cell.type === 'video'}
					<Video video={cell} i={i - 1} />
				{:else if cell.type === 'note'}
					<Note note={cell} i={i - 1} />
				{:else if cell.type === 'pdf'}
					<Pdf pdf={cell} i={i - 1} />
				{/if}
			{/each}
		{/await}
	</div>
</div>

<style>
	.transition-container {
		transition: transform 350ms cubic-bezier(0.625, 0.05, 0, 1);
		will-change: transform;
	}
</style>
