<script lang="ts">
	import { browser } from '$app/environment';
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { branch } from '$lib/stores/branch.svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import type { TPhoto } from '$lib/types/space';
	import { twJoin } from 'tailwind-merge';

	let windowWidth = $state(window.innerWidth);

	let panelSize = $derived.by(() => {
		if (windowWidth < 1280) {
			return 720;
		} else {
			return 800;
		}
	});
	const targetCoords = $derived.by(() => {
		if (!browser) return;
		if (windowWidth < 1024) return {};

		const targetX = (windowWidth + panelSize - branch.activeCell!.width) / 2;
		const targetY = (window.innerHeight - branch.activeCell!.height) / 2;

		return { x: targetX, y: targetY };
	});

	const coords = $derived.by(() => ({
		x: branch.activeCellIdx === i && targetCoords?.x ? targetCoords.x : photo.x,
		y: branch.activeCellIdx === i && targetCoords?.y ? targetCoords.y : photo.y
	}));

	$effect(() => {
		if (!browser) return;

		const handleResize = () => {
			windowWidth = window.innerWidth;
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	type Props = {
		photo: TPhoto;
		i: number;
	};

	let { photo, i }: Props = $props();
</script>

<button
	onclick={() => {
		backdrop.open();
		panel.open();
		branch.activeCellIdx = i;
		branch.activeCell = photo;
	}}
	class={twJoin(
		'custom-transform absolute overflow-hidden rounded-xl before:absolute before:inset-0 before:content-normal before:rounded-xl before:bg-gradient-to-t before:from-zinc-950/50 before:to-transparent before:opacity-0 before:transition-opacity before:duration-75',
		branch.activeCellIdx === -1 && 'hover:before:opacity-100'
	)}
	class:!pointer-events-auto={branch.activeCell?.url === photo.url}
	style="height: {photo.height}px; width: {photo.width}px; transform: translate({coords.x}px, {coords.y}px); z-index: {branch
		.activeCell?.url === photo.url
		? 998
		: 1}"
>
	<img src={photo.url} alt="" class="h-full w-full object-cover" />
</button>

<style>
	.custom-transform {
		will-change: transform;
		transition: transform 250ms cubic-bezier(0.65, 0.05, 0, 1);
	}
</style>
