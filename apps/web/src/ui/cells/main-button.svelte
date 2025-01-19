<script lang="ts">
	import SolarAddCircleBoldDuotone from '~icons/solar/add-circle-bold-duotone';
	import { cell } from '$lib/stores/cell.svelte';

	let { main } = $props();
</script>

<button
	aria-label="Create a cell"
	class="group absolute flex items-center justify-center bg-zinc-925 shadow-xl transition-colors hover:bg-zinc-900"
	style="height: {main.height}px; width: {main.width}px; transform: translate({main.x}px, {main.y}px);"
	onclick={() => cell.createNote()}
>
	<SolarAddCircleBoldDuotone
		height={96}
		width={96}
		class="text-zinc-50/20 transition-colors group-hover:text-zinc-50/40 group-active:text-zinc-50/30"
	/>
</button>
