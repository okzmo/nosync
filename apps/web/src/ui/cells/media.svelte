<script lang="ts">
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { branch } from '$lib/stores/branch.svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import type { TPhoto } from '$lib/types/space';
	import { twJoin } from 'tailwind-merge';

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
		'absolute transform-gpu overflow-hidden rounded-xl before:absolute before:inset-0 before:content-normal before:rounded-xl before:bg-gradient-to-t before:from-zinc-950/50 before:to-transparent before:opacity-0 before:transition-opacity before:duration-75',
		branch.activeCellIdx === -1 && 'hover:before:opacity-100'
	)}
	class:custom-transform={branch.activeCellIdx === i}
	class:!pointer-events-auto={branch.activeCell?.url === photo.url}
	style="height: {photo.height}px; width: {photo.width}px; transform: translate({photo.x}px, {photo.y}px); z-index: {branch.activeCellIdx ===
	i
		? 998
		: 1}"
>
	<img src={photo.url} alt="" class="h-full w-full object-cover" />
</button>

<style>
	.custom-transform {
		transition: transform 250ms cubic-bezier(0.65, 0.05, 0, 1);
	}
</style>
