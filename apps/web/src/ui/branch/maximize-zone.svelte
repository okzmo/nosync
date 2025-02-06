<script>
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { menu } from '$lib/stores/menu.svelte';
	import { cell } from '$lib/stores/cell.svelte';
	import { onMount } from 'svelte';
	import { expoOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import VideoPlayer from 'ui/video-player/video-player.svelte';

	let width = $state(0);

	function calculateResponsiveMediaWidth() {
		if (cell.maximized && cell.maximized.type !== 'pdf') {
			const res = (cell.maximized.originalWidth / window.innerWidth) * 100;
			width = res > 85 ? 85 : res;
		}
	}

	$effect(() => {
		if (cell.maximized && cell.maximized.type !== 'pdf') {
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
	<div
		role="presentation"
		onclick={() => {
			menu.closeMenu();
			backdrop.close();
		}}
		class="fixed left-0 top-0 z-[998] h-screen w-screen overflow-hidden"
		in:fly={{ duration: 350, y: 20, easing: expoOut, delay: 250 }}
		out:fly={{ duration: 100, y: 20, easing: expoOut }}
	>
		{#if cell.maximized.type === 'photo'}
			<figure
				in:fly={{ duration: 400, y: 20, delay: 400 }}
				out:fly={{ duration: 400, y: 20 }}
				style="aspect-ratio: {cell.maximized.originalWidth} / {cell.maximized
					.originalHeight}; padding-bottom: calc({cell.maximized.originalWidth} / {cell.maximized
					.originalHeight}); padding-left: {width}vw"
				class="absolute left-1/2 top-1/2 z-[998] max-h-[80vh] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-black before:absolute before:left-0 before:top-0 before:z-[11] before:h-full before:w-full before:content-normal before:border before:border-zinc-50/15"
			>
				{#if cell.maximized.originalUrl !== ''}
					<img
						src={cell.maximized.originalUrl}
						alt=""
						class="absolute left-0 z-10 h-full w-full select-none object-cover"
					/>
				{/if}
				<img
					alt=""
					class="absolute inset-0 h-full w-full select-none object-cover"
					src={cell.maximized.blurUrl}
				/>
			</figure>
		{:else if cell.maximized.type === 'video'}
			<VideoPlayer video={cell.maximized} bind:width />
		{:else if cell.maximized.type === 'pdf'}
			<embed
				src={cell.maximized.originalUrl}
				width={800}
				height={1000}
				class="fixed left-1/2 top-1/2 z-[998] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-black before:absolute before:left-0 before:top-0 before:z-[11] before:h-full before:w-full before:content-normal before:border before:border-zinc-50/15"
			/>
		{/if}
	</div>
{/if}
