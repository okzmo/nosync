<script lang="ts">
	let { children } = $props();
</script>

<div class="mt-4 flex items-center gap-x-2 px-5">
	<span class="block shrink-0 font-medium text-accent">{@render children()}</span>
	<div class="h-[1px] w-full bg-accent"></div>
</div>
