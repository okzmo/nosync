<script lang="ts">
	import Nosync from 'ui/icons/nosync.svelte';
	import Noise from 'ui/layout/noise.svelte';
</script>

<svelte:head>
	<title>Nosync</title>
</svelte:head>

<main class="h-screen w-screen bg-accent">
	<h1 class="sr-only">Nosync</h1>
	<div
		class="fixed mx-3 mt-2 lg:left-1/2 lg:top-1/2 lg:mx-0 lg:mt-6 lg:-translate-x-1/2 lg:-translate-y-1/2"
	>
		<Nosync class="not-sr-only w-full lg:w-[940px]" />
		<p class="relative mt-4 font-medium text-hometext md:max-w-[44rem] lg:mt-6">
			My work, my life, my notes, my memories, nosync exist simply because I wanted to keep all that
			close by in a simple app with a gorgeous interface that I can expand as much as I want.
			Keeping that to myself felt like a waste, so here it is. No marketing, no ads, no bullshit.
			Just you and me trying to build something that brings us joy. Take care.
		</p>
	</div>

	<Noise animation={false} />

	<div class="hidden lg:block">
		<span class="fixed left-2 top-2 h-2 w-8 bg-hometext"></span>
		<span class="fixed -left-1 top-5 h-2 w-8 rotate-90 bg-hometext"></span>
		<span class="fixed right-2 top-2 h-2 w-8 bg-hometext"></span>
		<span class="fixed -right-1 top-5 h-2 w-8 rotate-90 bg-hometext"></span>

		<span class="fixed bottom-2 left-2 h-2 w-8 bg-hometext"></span>
		<span class="fixed -left-1 bottom-5 h-2 w-8 rotate-90 bg-hometext"></span>
		<span class="fixed bottom-2 right-2 h-2 w-8 bg-hometext"></span>
		<span class="fixed -right-1 bottom-5 h-2 w-8 rotate-90 bg-hometext"></span>
	</div>

	<a
		href="/signin"
		class="group fixed bottom-4 left-1/2 -translate-x-1/2 font-home text-4xl uppercase text-hometext/50 transition-colors duration-75 hover:text-hometext"
	>
		Join
		<div
			class="absolute left-1/2 top-1/2 h-[5px] w-[0px] -translate-x-1/2 -translate-y-1/2 bg-hometext transition-all delay-75 duration-75 group-hover:w-[calc(100%+0.25rem)]"
		></div>
	</a>
</main>
