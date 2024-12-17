<script lang="ts">
	import { fade } from 'svelte/transition';
	import { menu } from '$lib/stores/menu.svelte';
</script>

<header class="fixed top-0 z-[999] w-full">
	{#if menu.open}
		<nav class="relative z-[1] flex justify-center pt-5" transition:fade={{ duration: 125 }}>
			<ul class="flex gap-x-6 font-serif text-lg italic text-zinc-50/50">
				<li><a href="/" class="text-zinc-50">home</a></li>
				<li><a href="/mail" class="hover:text-zinc-50/65 transition-colors">mail</a></li>
				<li><a href="/calendar" class="hover:text-zinc-50/65 transition-colors">calendar</a></li>
				<li><a href="/profile" class="hover:text-zinc-50/65 transition-colors">profile</a></li>
			</ul>
		</nav>
	{/if}

	<div
		class="progressive-blur up pointer-events-none -translate-y-full"
		class:active={menu.open}
	></div>
</header>

<style lang="postcss">
	.active {
		transform: translateY(0);
	}

	.progressive-blur.up {
		transition: transform 200ms cubic-bezier(0, 0.55, 0.45, 1);
		position: absolute;
		top: 0;
		left: 0;
		mask-image: linear-gradient(
			180deg,
			#fafafa 5%,
			rgba(250, 250, 250, 0.93) 30%,
			rgba(250, 250, 250, 0.78) 50%,
			rgba(250, 250, 250, 0.52) 75%,
			rgba(250, 250, 250, 0) 100%
		);
	}
</style>