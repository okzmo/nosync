<script lang="ts">
	import { Dialog } from 'bits-ui';
	import SLink from 'ui/changelogs/section-link.svelte';
	import Section from 'ui/changelogs/section.svelte';
	import Nosync from 'ui/icons/nosync.svelte';
	import MaterialSymbolsClose from '~icons/material-symbols/close';
</script>

<svelte:head>
	<title>Nosync</title>
</svelte:head>

<main class="p-5">
	<h1 class="sr-only">Nosync</h1>
	<Nosync class="not-sr-only" />
	<p class="relative mt-4 text-accent md:max-w-[44rem]">
		My work, my life, my notes, my memories, nosync exist simply because I wanted to keep all that
		close by in a simple app with a gorgeous interface that I can expand as much as I want. Keeping
		that to myself felt like a waste, so here it is. No marketing, no ads, no bullshit. Just you and
		me trying to build something that brings us joy. Take care.
	</p>
	<div class="mt-4 font-signature text-6xl text-accent">Okzmo</div>

	<a
		href="/signin"
		class="fixed bottom-4 left-1/2 -translate-x-1/2 border border-accent bg-accent/20 px-5 py-2 text-lg font-medium text-accent transition-colors duration-75 hover:bg-accent/35"
	>
		Join us
	</a>

	<Dialog.Root>
		<Dialog.Trigger
			class="fixed bottom-4 right-0 -translate-x-1/2 border border-accent bg-accent/20 px-4 py-2 text-lg font-medium text-accent transition-colors duration-75 hover:bg-accent/35"
		>
			?
		</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay class="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-3xl" />
			<Dialog.Content
				class="shadow-popover fixed left-[50%] top-[50%] z-50 h-full max-h-[75%] w-full max-w-[90%] translate-x-[-50%] translate-y-[-50%] border border-accent/50 bg-zinc-950 outline-none sm:h-[550px] sm:max-w-[450px] md:w-full"
			>
				<div class="flex h-full flex-col overflow-y-auto">
					<Dialog.Close
						class="absolute right-2 top-2 border border-accent/40 bg-accent/10 p-1 text-accent/40 backdrop-blur-xl transition-colors duration-75 hover:border-accent hover:bg-accent/25 hover:text-accent"
					>
						<MaterialSymbolsClose height={18} width={18} />
					</Dialog.Close>
					<h2
						class="mb-4 bg-gradient-to-b from-accent/35 to-transparent px-5 py-5 font-serif text-5xl italic md:text-6xl"
					>
						<span class="mix-blend-soft-light">Presentation</span>
					</h2>
					<p class="mx-5 w-fit border border-accent bg-accent/20 px-2 py-1 text-sm text-accent">
						v0.1.0
					</p>
					<Section title="What's nosync ?">
						Nosync offers a comprehensive solution for managing a wide range of content, including
						videos, photos, PDFs, and notes. If there's a specific type of content you'd like to see
						supported in the future, we encourage you to share your feedback, as your input is
						invaluable in shaping nosync. One of the key features of Nosync is its AI-powered
						tagging system, which automatically categorizes your content to make it easily
						searchable.<br /><br /> For instance, if you capture a stunning sunset at the beach, the
						AI might automatically assign tags like "sunset," "beach," "ocean," and "peaceful." This
						means that whenever you search for "sunset," you'll instantly find that photo along with
						other relevant images, all without any manual effort. You can of course add a title or some
						legend to it if you want to make the search even more precise, if you were with your dog
						for example you can add “Jax’s first stroll at the beach” and “Jax” will become a keyword
						you can search for!
					</Section>
					<Section title="Who made it ?">
						<SLink href="https://mathii.eu">Mathieu "okzmo" Rossi</SLink>, I’m a French developer
						working on another product called <SLink href="https://kyono.app">Kyono</SLink> and this
						one, I love working on stuff that are either helpful to me or others or something difficult,
						or sometimes both
					</Section>
				</div>
				<div
					class="absolute bottom-0 left-0 h-5 w-full bg-gradient-to-t from-zinc-950 to-transparent"
				></div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</main>
