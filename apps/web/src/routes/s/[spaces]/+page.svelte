<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte';
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { gallery } from '$lib/stores/gallery.svelte';
	import { onMount } from 'svelte';
	import { twJoin } from 'tailwind-merge';

	let { data: photos } = $props();

	onMount(async () => {
		gallery.calculatePhotosSizes(photos.hits);

		window.addEventListener('resize', () => gallery.calculatePhotosSizes(photos.hits));
	});

	$effect(() => {
		if (!backdrop.blur) {
			setTimeout(() => {
				gallery.activePhoto = -1;
			}, 75);
		}
	});
</script>

<div class="relative h-screen w-screen overflow-auto p-4">
	{#each gallery.photos as photo, i}
		<button
			onclick={() => {
				gallery.activePhoto = i;
				backdrop.set(true);
				backdrop.setBlur(true);
			}}
			class={twJoin(
				'absolute overflow-hidden rounded-xl before:absolute before:inset-0 before:content-normal before:rounded-xl before:bg-black/25 before:opacity-0 before:transition-opacity before:duration-75',
				gallery.activePhoto === -1 && 'hover:before:opacity-100'
			)}
			class:z-[998]={gallery.activePhoto === i}
			style="height: {photo.height}px; width: {photo.width}px; transform: translate({photo.x}px, {photo.y}px);"
		>
			<img src={photo.url} alt="" class="h-full w-full object-cover" />
		</button>
	{/each}
</div>
