<script lang="ts">
	import { tuyau } from '$lib/api';
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { branch } from '$lib/stores/branch.svelte';
	import { cell } from '$lib/stores/cell.svelte';
	import { global } from '$lib/stores/global.svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import { space } from '$lib/stores/space.svelte';
	import { onDestroy, onMount } from 'svelte';
	import Dropzone from 'ui/branch/dropzone.svelte';
	import MaximizeZone from 'ui/branch/maximize-zone.svelte';
	import MainButton from 'ui/cells/main-button.svelte';
	import Media from 'ui/cells/media.svelte';
	import Note from 'ui/cells/note.svelte';

	const shownCells = $derived.by(async () => {
		if (!global.ready) return [];

		if (!branch.cells) {
			const { data, error } = await tuyau.v1.branch
				.cells({ branchId: '' + space.currentBranch?.id })
				.$get();

			if (error) {
				console.error(error);
			}

			branch.cells = data;
		}

		return branch.processCells(branch.cells);
	});

	let squares = $state<number[][]>([]);

	function calculateGrid() {
		const { innerWidth, innerHeight } = window;
		const spacing = 75; // Distance between dots in pixels
		const columns = Math.floor(innerWidth / spacing);
		const rows = Math.floor(innerHeight / spacing);

		squares = Array(rows * columns).fill(0);
	}

	onMount(async () => {
		window.addEventListener('resize', () => branch.processCells(branch.cells));
		window.addEventListener('resize', calculateGrid);
		calculateGrid();
	});

	onDestroy(() => {
		window.removeEventListener('resize', () => branch.processCells(branch.cells));
		window.removeEventListener('resize', calculateGrid);
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
<MaximizeZone />
<div id="dot-grid" class="grid-container">
	{#each squares as _}
		<div class="grid-square"></div>
	{/each}
</div>

<div class="relative h-screen w-screen overflow-auto p-4" bind:this={branch.cellWrapper}>
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

<style>
	.grid-container {
		display: grid;
		width: 100vw;
		height: 100vh;
		grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
		grid-auto-rows: 1fr;
		position: fixed;
		left: 0;
		top: 0;
		pointer-events: none;
		mask-image: radial-gradient(rgba(255, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 75%);
	}

	.grid-square {
		border: 1px solid rgba(255, 255, 255, 0.1);
		aspect-ratio: 1;
	}

	/* Ensure the container takes up full viewport */
	:global(body, html) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
