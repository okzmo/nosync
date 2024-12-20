<script lang="ts">
	import Navigation from '../../../../ui/layout/navigation.svelte';
	import Search from '../../../../ui/layout/search.svelte';
	import { onMount } from 'svelte';
	import { menu } from '$lib/stores/menu.svelte';
	import { global } from '$lib/stores/global.svelte';
	import Panel from '../../../../ui/panel/panel.svelte';
	import Backdrop from '../../../../ui/layout/backdrop.svelte';
	import { panel } from '$lib/stores/panel.svelte';

	let { children } = $props();

	onMount(() => {
		global.init();
		menu.init();
	});
</script>

<Navigation />
{@render children()}
<Search />

<Panel bind:isOpen={panel.isOpen} />
<Backdrop />
