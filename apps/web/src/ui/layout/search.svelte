<script lang="ts">
	import { menu } from '$lib/stores/menu.svelte';
	import { fade } from 'svelte/transition';
	import { fly } from 'svelte/transition';
	import { search } from '$lib/stores/search.svelte';

	let input = $state<HTMLInputElement | null>(null);

	async function handleKeydown(e: KeyboardEvent) {
		if (!input || input !== document.activeElement) return;

		if (e.key === 'Backspace') {
			if (search.value === '' && search.activeCommand) {
				e.preventDefault();
				search.resetCommand();
			}
		}

		if (e.key === 'Tab') {
			e.preventDefault();
			const query = search.value.toLowerCase();

			if (query === '') return;
			if (search.isCommand(query)) {
				search.launchEffect();
				search.value = '';
			}
		}

		if (e.key === 'Enter') {
			e.preventDefault();

			if (search.activeCommand) {
				search.executeCommand(search.value);
				search.resetCommand();
				menu.closeMenu();
				search.value = '';
			}
		}
	}

	$effect(() => {
		if (menu.open) {
			input?.focus();
		}
	});
</script>

<div class="fixed bottom-0 z-[999] w-full">
	{#if menu.open}
		<div class="flex items-center gap-x-3 px-14 pb-8">
			{#if search.activeCommand}
				{@const Icon = search.activeCommand.icon}
				<div
					transition:fly={{ x: -5, duration: 45 }}
					class="z-10 flex flex-shrink-0 items-center gap-x-2 rounded-[0.65rem] py-[0.4rem] pl-2 pr-3"
					style="background-color: {search.activeCommand.bgColor}; color: {search.activeCommand
						.textColor}; box-shadow: {search.activeCommand.boxShadow}"
				>
					<Icon className="[&>path]:mix-blend-overlay" height={24} width={24} />
					<span class="font-serif text-xl italic !leading-none">{search.activeCommand.label}</span>
				</div>
			{/if}
			<input
				bind:this={input}
				bind:value={search.value}
				onkeydown={handleKeydown}
				autocomplete="off"
				spellcheck="false"
				type="text"
				placeholder={search.placeholder}
				class="relative z-[1] w-full border-none bg-transparent font-serif text-5xl italic leading-none text-zinc-50 placeholder:text-zinc-50/30 focus:outline-none focus:ring-0"
				transition:fade={{ duration: 45 }}
			/>
		</div>
	{/if}
	<div class="progressive-blur down pointer-events-none opacity-0" class:active={menu.open}></div>
</div>

<style lang="postcss">
	.active {
		opacity: 100%;
	}

	.progressive-blur.down {
		transition: opacity 45ms cubic-bezier(0, 0.55, 0.45, 1);
		position: absolute;
		bottom: 0;
		left: 0;
		mask-image: linear-gradient(
			0deg,
			#fafafa 5%,
			rgba(250, 250, 250, 0.93) 30%,
			rgba(250, 250, 250, 0.78) 50%,
			rgba(250, 250, 250, 0.52) 75%,
			rgba(250, 250, 250, 0) 100%
		);
	}
</style>
