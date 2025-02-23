<script lang="ts">
	import { cell } from '$lib/stores/cell.svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import type { Content } from '@tiptap/core';
	import { expoInOut } from 'svelte/easing';
	import { fade, fly, scale } from 'svelte/transition';
	import { twJoin } from 'tailwind-merge';
	import Editor from 'ui/editor/editor.svelte';
	import MaterialSymbolsArrowBackRounded from '~icons/material-symbols/arrow-back-rounded';

	let title = $state('');
	let content = $state<{ id: string; content?: Content } | undefined>();
	let saving = $state('onhold');
	let typing = $state(false);

	function handleBlur() {
		cell.saveTitle(title);
	}

	$effect(() => {
		if (cell.active) {
			title = cell.active.title;
			content = { id: cell.active.id, content: cell.active.content };
		}
	});
</script>

{#if panel.isFullscreen && cell.active}
	<div
		class="fixed left-0 top-0 z-[998] flex h-screen w-screen bg-zinc-950"
		in:scale={{ delay: 350, duration: 300, start: 1.015, easing: expoInOut }}
		out:scale={{ delay: 200, duration: 300, start: 1.035, easing: expoInOut }}
	>
		<button
			onclick={() => panel.toggleFullscreen()}
			class={twJoin(
				'custom-easing group fixed left-8 top-8 z-[999] flex -translate-x-4 items-center gap-x-2 rounded-md px-2 py-1 font-serif text-xl italic text-zinc-50/40 transition duration-500  hover:translate-x-0 hover:text-zinc-50 hover:!opacity-100',
				typing ? 'opacity-20' : 'opacity-100'
			)}
		>
			<div class="custom-easing opacity-0 transition-opacity duration-500 group-hover:opacity-100">
				<MaterialSymbolsArrowBackRounded height={18} width={18} />
			</div>
			Go back
		</button>
		<div class="mx-auto flex w-[40%] flex-col pt-[10rem]">
			{#if cell.active.type === 'photo' || cell.active.type === 'video'}
				<figure class="relative">
					<img
						src={cell.active.resizedUrl || cell.active.thumbnailUrl}
						alt={cell.active.tags}
						class={twJoin(
							'object-cover',
							cell.active.aspectRatio > 1 ? 'h-[150px] w-[250px]' : 'h-[200px] w-[150px]'
						)}
					/>
					<img
						src={cell.active.blurUrl}
						alt={cell.active.tags}
						class={twJoin(
							'absolute left-0 top-0 z-[-1] object-cover blur-lg transition-opacity',
							cell.active.aspectRatio > 1 ? 'h-[150px] w-[250px]' : 'h-[200px] w-[150px]',
							typing ? 'opacity-0' : 'opacity-100'
						)}
					/>
				</figure>
			{/if}
			<input
				type="text"
				class="mt-16 border-none bg-transparent p-0 font-serif text-5xl italic placeholder:text-zinc-50/20 focus-visible:outline-none focus-visible:ring-0"
				placeholder="Title"
				bind:value={title}
				onblur={handleBlur}
			/>
			<Editor transparent {content} bind:saving bind:typing />
		</div>
	</div>
{/if}
