<script lang="ts">
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { menu } from '$lib/stores/menu.svelte';
</script>

<div
	role="presentation"
	class="backdrop-transition pointer-events-none fixed left-0 top-0 z-[997] h-screen w-screen bg-black/65 opacity-0 backdrop-blur-md transition-opacity duration-100"
	onclick={() => {
		menu.closeMenu();
		backdrop.close();
	}}
	class:opacity-100={backdrop.blur}
	class:pointer-events-auto={backdrop.active}
></div>
