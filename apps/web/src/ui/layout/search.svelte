<script lang="ts">
	import { tuyau } from '$lib/api';
	import { branch } from '$lib/stores/branch.svelte';
	import { menu } from '$lib/stores/menu.svelte';
	import { space } from '$lib/stores/space.svelte';
	import { fade } from 'svelte/transition';
	import { fly } from 'svelte/transition';
	import { search } from '$lib/stores/search.svelte';

	let input = $state<HTMLInputElement | null>(null);
	let inputValue = $state('');

	async function handleInput() {
		if (search.activeCommand) return;
		const { data, error } = await tuyau.v1.branch.search_cells.$post({
			branchId: space.currentBranch!.id,
			query: inputValue || ''
		});

		if (error) {
			console.error(error);
		}

		branch.cells = data;
	}

	async function handleKeydown(e: KeyboardEvent) {
		if (!input || input !== document.activeElement) return;

		if (e.key === 'Backspace') {
			if (inputValue === '' && search.activeCommand) {
				e.preventDefault();
				search.resetCommand();
			}
		}

		if (e.key === 'Tab') {
			e.preventDefault();

			if (search.isCommand(inputValue.toLowerCase())) {
				search.executeEffect();
				inputValue = '';
			}

			const { data, error } = await tuyau.v1.branch.search_cells.$post({
				branchId: space.currentBranch!.id,
				query: ''
			});

			if (error) {
				console.error(error);
			}

			branch.cells = data;
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
					transition:fly={{ x: -5, duration: 75 }}
					class="z-10 flex flex-shrink-0 items-center gap-x-2 rounded-[0.95rem] py-[0.4rem] pl-2 pr-3"
					style="background-color: {search.activeCommand.color}; color: {search.activeCommand
						.textColor}; box-shadow: {search.activeCommand.boxShadow}"
				>
					<Icon className="[&>path]:mix-blend-overlay" height={24} width={24} />
					<span class="font-serif text-xl italic !leading-none">{search.activeCommand.label}</span>
				</div>
			{/if}
			<input
				bind:this={input}
				bind:value={inputValue}
				oninput={handleInput}
				onkeydown={handleKeydown}
				type="text"
				placeholder="Search"
				class="relative z-[1] w-full border-none bg-transparent font-serif text-5xl italic leading-none text-zinc-50 placeholder:text-zinc-50/30 focus:outline-none focus:ring-0"
				transition:fade={{ duration: 75 }}
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
		transition: opacity 200ms cubic-bezier(0, 0.55, 0.45, 1);
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
