<script lang="ts">
	import '@fontsource/chivo-mono/300.css';
	import '@fontsource/rethink-sans/400.css';
	import '@fontsource/rethink-sans/500.css';
	import '@fontsource/rethink-sans/600.css';
	import '@fontsource/vollkorn';
	import '@fontsource/vollkorn/400-italic.css';
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}

<style lang="postcss">
	:global(body) {
		@apply bg-zinc-950 text-zinc-50;
	}

	:global(::-webkit-scrollbar) {
		display: none;
	}

	:global(*) {
		scrollbar-width: none;
	}
</style>
