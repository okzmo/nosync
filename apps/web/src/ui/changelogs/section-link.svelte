<script lang="ts">
	let { href, children } = $props();
</script>

<a {href} class="underline decoration-accent decoration-[0.1rem]">
	{@render children()}
</a>
