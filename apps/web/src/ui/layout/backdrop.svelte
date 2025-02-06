<script lang="ts">
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { menu } from '$lib/stores/menu.svelte';
</script>

<div
	role="presentation"
	class="backdrop-transition transition-backdrop pointer-events-none fixed left-0 top-0 z-[997] h-screen w-screen bg-black/65 opacity-0 backdrop-blur-md duration-100"
	onclick={() => {
		menu.closeMenu();
		backdrop.close();
	}}
	class:opacity-100={backdrop.blur}
	class:pointer-events-auto={backdrop.active}
></div>

<style>
	.transition-backdrop {
		transition:
			opacity 500ms cubic-bezier(0.625, 0.05, 0, 1),
			backdrop-filter 500ms cubic-bezier(0.625, 0.05, 0, 1);
	}
</style>
