<script lang="ts">
	import { global } from '$lib/stores/global.svelte';
	import { menu } from '$lib/stores/menu.svelte';
	import { space } from '$lib/stores/space.svelte';
	import { onMount } from 'svelte';
	import Backdrop from 'ui/layout/backdrop.svelte';
	import Navigation from 'ui/layout/navigation.svelte';
	import Search from 'ui/layout/search.svelte';
	import Panel from 'ui/panel/panel.svelte';

	let { children } = $props();

	onMount(async () => {
		global.init();
		menu.init();
		global.initializeTransmit();
		global.subscribeTo(space.currentBranch!.id);
	});
</script>

<Navigation />
{@render children()}
<Search />

<Panel />
<Backdrop />
