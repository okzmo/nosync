<script lang="ts">
	import SectionTitle from './section-title.svelte';

	let { title, children } = $props();
</script>

<section class="mb-0 last:mb-5">
	<SectionTitle>{title}</SectionTitle>
	<p class="mt-1 px-5">
		{@render children()}
	</p>
</section>
