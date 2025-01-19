<script lang="ts">
	import type { Content } from '@tiptap/core';
	import Editor from 'ui/editor/editor.svelte';
	import SolarTrashBin2BoldDuotone from '~icons/solar/trash-bin-2-bold-duotone';
	import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded';
	import MaterialSymbolsCheckRounded from '~icons/material-symbols/check-rounded';
	import { cell } from '$lib/stores/cell.svelte';
	import { twJoin } from 'tailwind-merge';
	import { panel } from '$lib/stores/panel.svelte';

	let content = $state<Content | undefined>();
	let typing = $state(false);
	let title = $state('');
	let editTitle = $state(false);
	let titleInput = $state<HTMLInputElement | null>();

	function deleteActiveCell() {
		cell.delete(cell.active?.id, cell.activeIdx);
		panel.close();
		cell.active = undefined;
		cell.activeIdx = -1;
	}

	$effect(() => {
		if (cell.active) {
			title = cell.active.title;
			content = cell.active.content;
		}
	});

	$effect(() => {
		if (editTitle && titleInput) {
			titleInput.focus();
		}
	});
</script>

<aside
	class="sticky left-4 top-4 flex h-[calc(100vh-32px)] w-[400px] flex-col gap-y-3 border-[0.5px] border-zinc-700 p-3"
>
	{#if cell.active?.url}
		<figure
			class={twJoin(
				'w-full overflow-hidden bg-zinc-925',
				cell.active?.aspectRatio > 1 ? 'h-[250px]' : 'h-[450px]'
			)}
		>
			<img src={cell.active?.url} alt="" class="h-full w-full object-cover" />
		</figure>
	{/if}
	<div
		role="button"
		tabindex="0"
		onclick={(e) => {
			if (e.detail === 2) {
				editTitle = true;
			}
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				editTitle = true;
			}
		}}
		class={twJoin(
			'flex h-[3.25rem] w-full items-center justify-between bg-zinc-925 px-3 transition-colors',
			!editTitle && ' hover:bg-zinc-900 active:bg-zinc-925'
		)}
	>
		{#if !editTitle}
			<p class="select-none text-lg font-bold uppercase">Title:</p>
			<p class="select-none">{title}</p>
		{:else}
			<input
				bind:this={titleInput}
				bind:value={title}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						e.stopPropagation();
						editTitle = false;
						cell.saveTitle(title);
					}
				}}
				class="w-[calc(100%-2.75rem)] border-[0px] bg-transparent p-0 focus-visible:outline-none focus-visible:ring-0"
			/>
			<button
				class="absolute right-[1rem] flex h-[2.75rem] w-[2.75rem] items-center justify-center bg-zinc-900 text-zinc-50/50 transition-colors hover:bg-zinc-800 hover:text-green-500"
				onclick={(e) => {
					e.stopPropagation();
					editTitle = false;
					cell.saveTitle(title);
				}}
			>
				<MaterialSymbolsCheckRounded />
			</button>
		{/if}
	</div>
	<div class="flex h-[3.25rem] w-full items-center justify-between bg-zinc-925 px-3">
		<p class="select-none text-lg font-bold uppercase">Date:</p>
		<date class="select-none">{cell.active?.createdAt}</date>
	</div>
	<Editor {content} bind:typing />
	<div class="flex w-full items-center justify-between gap-x-3">
		<div class="h-[3rem] flex-1 bg-zinc-925"></div>
		<button
			aria-label="Delete"
			onclick={deleteActiveCell}
			class="flex h-[3rem] w-[3rem] items-center justify-center bg-zinc-925 text-zinc-50/50 transition-colors hover:bg-red-500 hover:text-zinc-50"
		>
			<SolarTrashBin2BoldDuotone />
		</button>
		<button
			aria-label="Delete"
			onclick={() => {
				panel.close();
			}}
			class="flex h-[3rem] w-[3rem] items-center justify-center bg-zinc-925 text-zinc-50/50 transition-colors hover:text-zinc-50"
		>
			<MaterialSymbolsCloseRounded height={22} width={22} />
		</button>
	</div>
</aside>
