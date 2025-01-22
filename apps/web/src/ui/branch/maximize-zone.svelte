<script>
	import { cell } from '$lib/stores/cell.svelte';
	import { onMount } from 'svelte';
	import VideoPlayer from './video-player.svelte';

	let width = $state(0);

	function calculateResponsiveMediaWidth() {
		if (cell.maximized) {
			const res = (cell.maximized.originalWidth / window.innerWidth) * 100;
			console.log(cell.maximized.originalWidth, res);
			width = res > 85 ? 85 : res;
		}
	}

	$effect(() => {
		if (cell.maximized) {
			const res = (cell.maximized.originalWidth / window.innerWidth) * 100;
			width = res > 85 ? 85 : res;
		}
	});

	onMount(() => {
		window.addEventListener('resize', calculateResponsiveMediaWidth);

		return () => {
			window.removeEventListener('resize', calculateResponsiveMediaWidth);
		};
	});
</script>

{#if cell.maximized}
	{#if cell.maximized.type === 'photo'}
		<figure
			style="aspect-ratio: {cell.maximized.originalWidth} / {cell.maximized
				.originalHeight}; padding-bottom: calc({cell.maximized.originalWidth} / {cell.maximized
				.originalHeight}); padding-left: {width}vw"
			class="fixed left-1/2 top-1/2 z-[998] max-h-[80vh] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-black before:absolute before:left-0 before:top-0 before:z-[11] before:h-full before:w-full before:content-normal before:border before:border-zinc-50/15"
		>
			<img
				src={cell.maximized.originalUrl}
				alt=""
				class="absolute left-0 z-10 h-full w-full select-none object-cover"
			/>
			<img
				alt=""
				class="absolute inset-0 h-full w-full select-none object-cover"
				src={cell.maximized.blurUrl}
			/>
		</figure>
	{:else if cell.maximized.type === 'video'}
		<VideoPlayer video={cell.maximized} bind:width />
	{/if}
{/if}
