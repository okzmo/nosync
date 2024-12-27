<script lang="ts">
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { cell } from '$lib/stores/cell.svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import type { TPhoto } from '$lib/types/space';
	import SolarPenNewSquareBoldDuotone from '~icons/solar/pen-new-square-bold-duotone';

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
	}}
	onmouseover={() => {
		cell.activeIdx = i;
		cell.active = photo;
	}}
	onfocus={() => {
		cell.activeIdx = i;
		cell.active = photo;
	}}
	class="group absolute transform-gpu overflow-hidden rounded-2xl before:absolute before:inset-0 before:content-normal before:rounded-2xl before:bg-gradient-to-t before:from-zinc-950/50 before:to-transparent before:opacity-0 before:transition-opacity before:duration-75 hover:before:opacity-100 active:before:opacity-80"
	style="height: {photo.height}px; width: {photo.width}px; transform: translate({photo.x}px, {photo.y}px);"
>
	<img src={photo.url} alt="" class="h-full w-full object-cover" />
	{#if photo.title}
		<h3
			class="absolute bottom-3 left-5 font-serif text-xl italic opacity-0 transition-opacity group-hover:opacity-100"
		>
			{photo.title}
		</h3>
	{/if}

	{#if photo.content}
		<SolarPenNewSquareBoldDuotone
			class="absolute right-3 top-3 text-zinc-50/40 transition-colors group-hover:text-zinc-50"
			height={20}
			width={20}
		/>
	{/if}
</button>
