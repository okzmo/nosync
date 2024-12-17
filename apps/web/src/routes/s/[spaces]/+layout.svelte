<script lang="ts">
	import Navigation from '../../../ui/layout/navigation.svelte';
	import Search from '../../../ui/layout/search.svelte';
	import { onMount } from 'svelte';
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { menu } from '$lib/stores/menu.svelte';

	let { children } = $props();

	onMount(() => {
		menu.init();
	});
</script>

<Navigation />
{@render children()}
<Search />

<div
	onclick={() => menu.closeMenu()}
	class="backdrop-transition pointer-events-none fixed left-0 top-0 z-[997] h-screen w-screen bg-zinc-950/65 opacity-0 backdrop-blur-3xl transition-opacity duration-75"
	class:opacity-100={backdrop.blur}
	class:pointer-events-auto={backdrop.active}
></div>
