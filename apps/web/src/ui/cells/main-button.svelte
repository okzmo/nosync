<script lang="ts">
	import SolarAddCircleBoldDuotone from '~icons/solar/add-circle-bold-duotone';
	import { branch } from '$lib/stores/branch.svelte';
	import { mainStore } from '$lib/stores/mainStore.svelte';
</script>

<button
	aria-label="Create a cell"
	class="group absolute flex items-center justify-center bg-zinc-925 shadow-xl transition-colors hover:bg-zinc-900"
	style="height: {mainStore.colWidth}px; width: {mainStore.colWidth}px; transform: translate(0px, 0px);"
	onclick={() => branch.createNote()}
>
	<SolarAddCircleBoldDuotone
		height={96}
		width={96}
		class="text-zinc-50/20 transition-colors group-hover:text-zinc-50/40 group-active:text-zinc-50/30"
	/>
</button>
