<script lang="ts">
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { branch } from '$lib/stores/branch.svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import type { TPhoto } from '$lib/types/space';

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
	class="absolute transform-gpu overflow-hidden rounded-xl before:absolute before:inset-0 before:content-normal before:rounded-xl before:bg-gradient-to-t before:from-zinc-950/50 before:to-transparent before:opacity-0 before:transition-opacity before:duration-75 hover:before:opacity-100"
	style="height: {photo.height}px; width: {photo.width}px; transform: translate({photo.x}px, {photo.y}px);"
>
	<img src={photo.url} alt="" class="h-full w-full object-cover" />
</button>
