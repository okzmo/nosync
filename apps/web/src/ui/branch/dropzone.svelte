<script lang="ts">
	import { dropzone } from '$lib/stores/dropzone.svelte';
	import { space } from '$lib/stores/space.svelte';
	import { onDestroy, onMount } from 'svelte';

	onMount(async () => {
		document.addEventListener('dragenter', dropzone.handleDragEnter);
		document.addEventListener('dragover', dropzone.handleDragOver);
		document.addEventListener('dragleave', dropzone.handleDragLeave);
	});

	onDestroy(() => {
		document.removeEventListener('dragenter', dropzone.handleDragEnter);
		document.removeEventListener('dragover', dropzone.handleDragOver);
		document.removeEventListener('dragleave', dropzone.handleDragLeave);
	});
</script>

{#if dropzone.isOpen}
	<div
		class="fixed left-0 top-0 z-[20] h-screen w-screen bg-black/70"
		role="region"
		aria-label="File upload dropzone"
		ondrop={dropzone.handleDrop}
	>
		<div
			class="pointer-events-none absolute left-1/2 top-1/2 flex h-[20rem] w-[25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-zinc-50/30 bg-zinc-950"
		>
			Upload to {space.currentSpace?.name} / {space.currentBranch?.name}
		</div>
	</div>
{/if}
