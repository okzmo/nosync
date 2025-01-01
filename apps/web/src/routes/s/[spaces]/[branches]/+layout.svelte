<script lang="ts">
	import { branch } from '$lib/stores/branch.svelte';
	import { global } from '$lib/stores/global.svelte';
	import { menu } from '$lib/stores/menu.svelte';
	import { onMount } from 'svelte';
	import Backdrop from 'ui/layout/backdrop.svelte';
	import Navigation from 'ui/layout/navigation.svelte';
	import Search from 'ui/layout/search.svelte';
	import Panel from 'ui/panel/panel.svelte';

	let { children } = $props();

	onMount(async () => {
		global.init();
		menu.init();
		branch.initializeTransmit();
	});
</script>

<Navigation />
{@render children()}
<Search />

<Panel />
<Backdrop />
