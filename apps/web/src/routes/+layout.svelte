<script lang="ts">
	import '@fontsource/chivo-mono/300.css';
	import '@fontsource/instrument-sans/400.css';
	import '@fontsource/instrument-sans/500.css';
	import '@fontsource/instrument-sans/600.css';
	import '@fontsource/vollkorn';
	import '@fontsource/vollkorn/400-italic.css';
	import '../app.css';
	import '../code.css';

	let { children } = $props();
</script>

{@render children()}
