<script lang="ts">
	import SolarAddCircleBoldDuotone from '~icons/solar/add-circle-bold-duotone';
	import { cell } from '$lib/stores/cell.svelte';

	let { main } = $props();
</script>

<button
	aria-label="Create a cell"
	class="group absolute flex items-center justify-center rounded-2xl border border-zinc-50/10 bg-zinc-900 shadow-2xl transition-colors hover:border-zinc-50/30 active:border-zinc-50/20"
	style="height: {main.height}px; width: {main.width}px; transform: translate({main.x}px, {main.y}px);"
	onclick={() => cell.createNote()}
>
	<SolarAddCircleBoldDuotone
		height={96}
		width={96}
		class="text-zinc-50/20 transition-colors group-hover:text-zinc-50/40 group-active:text-zinc-50/30"
	/>
</button>
