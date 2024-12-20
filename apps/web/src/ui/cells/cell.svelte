<script lang="ts">
	import { branch } from '$lib/stores/branch.svelte';
	import Media from './media.svelte';
	import Note from './note.svelte';
</script>

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
