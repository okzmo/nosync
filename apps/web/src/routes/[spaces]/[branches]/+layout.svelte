<script lang="ts">
	import { mainStore } from '$lib/stores/mainStore.svelte';
	import { menu } from '$lib/stores/menu.svelte';
	import { search } from '$lib/stores/search.svelte';
	import { onMount } from 'svelte';
	import Backdrop from 'ui/layout/backdrop.svelte';
	import Navigation from 'ui/layout/navigation.svelte';
	import Noise from 'ui/layout/noise.svelte';
	import Search from 'ui/layout/search.svelte';
	import Settings from 'ui/settings/settings.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	onMount(async () => {
		mainStore.init();
		menu.init();
		mainStore.initializeTransmit();
		mainStore.setupPDFWorker();

		window.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		});
	});
</script>

<Navigation />
{@render children()}
<Search />

<Backdrop />
<Noise animation={false} opacity={0.15} />

{#if page.state.showSettings}
	<Settings />
{/if}

<div
	class="pointer-events-none fixed left-0 top-0 z-[999] h-screen w-screen transition"
	style="box-shadow: inset 0px 0px 50px {search.effect
		? search.activeCommand?.bgColor
		: '#ffffff00'}"
></div>
