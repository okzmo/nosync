<script lang="ts">
	import Editor from 'ui/editor/editor.svelte';
	import SolarTrashBin2BoldDuotone from '~icons/solar/trash-bin-2-bold-duotone';
	import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded';
	import MaterialSymbolsCheckRounded from '~icons/material-symbols/check-rounded';
	import EosIconsThreeDotsLoading from '~icons/eos-icons/three-dots-loading';
	import SolarEyeBoldDuotone from '~icons/solar/eye-bold-duotone';
	import { cell } from '$lib/stores/cell.svelte';
	import { twJoin } from 'tailwind-merge';
	import { sidebar } from '$lib/stores/sidebar.svelte';
	import type { JSONContent } from '@tiptap/core';
	import { sanitize } from '$lib/utils/string';

	let editTitle = $state(false);
	let titleInput = $state<HTMLInputElement | null>();
	let saving = $state('onhold');
	let title = $state('');
	let processedTitle = $derived(sanitize(title, 32));
	let content = $state<JSONContent | undefined>();

	function handleInput() {
		if (!titleInput) return;

		title = titleInput.value;
		titleInput.value = processedTitle;
	}

	function deleteActiveCell() {
		if (!cell.active) return;
		cell.delete(cell.active.id, cell.activeIdx);
		editTitle = false;
		sidebar.close();
		cell.active = undefined;
		cell.activeIdx = -1;
	}

	$effect(() => {
		if (!sidebar.isOpen) {
			editTitle = false;
		}

		if (cell.active) {
			title = cell.active.title;
			content = cell.active.content;
		}

		if (editTitle && titleInput) {
			titleInput.focus();
		}
	});
</script>

<aside
	class="sticky left-4 top-4 flex h-[calc(100vh-32px)] w-[400px] flex-col gap-y-3 border-[0.5px] border-zinc-700 p-3"
>
	{#if cell.active?.type === 'photo' || cell.active?.type === 'video'}
		<figure
			class={twJoin(
				'transition-height w-full overflow-hidden bg-zinc-925',
				cell.active.aspectRatio > 1
					? 'h-[250px]'
					: cell.active.aspectRatio === 1
						? 'h-[400px]'
						: 'h-[450px]'
			)}
		>
			<img
				src={cell.active?.resizedUrl || cell.active?.thumbnailUrl}
				alt=""
				draggable="false"
				class="h-full w-full select-none object-cover"
			/>
		</figure>
	{/if}
	<div
		role="button"
		tabindex="0"
		onclick={() => (editTitle = true)}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				editTitle = true;
			}
		}}
		class={twJoin(
			'flex h-[3.25rem] w-full items-center justify-between bg-zinc-925 px-3 transition-colors hover:cursor-text',
			!editTitle && ' hover:bg-zinc-900 active:bg-zinc-925'
		)}
	>
		{#if !editTitle}
			<p class="select-none text-lg font-bold uppercase">Title:</p>
			<p class="select-none">{title}</p>
		{:else}
			<input
				bind:this={titleInput}
				value={processedTitle}
				oninput={handleInput}
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
	<Editor {content} bind:saving />
	<div class="flex w-full items-center justify-between gap-x-3">
		<div class="flex h-[3rem] flex-1 items-center justify-center bg-zinc-925">
			{#if saving === 'saving'}
				<EosIconsThreeDotsLoading height={42} width={42} class="text-zinc-50/50" />
			{:else if saving === 'saved'}
				<p class="font-medium">Saved!</p>
			{/if}
		</div>
		<button
			onclick={() => {
				editTitle = false;
				sidebar.close();
				sidebar.toggleFocusMode();
				sidebar.editorFocusmode?.commands.focus();
			}}
			aria-label="Focus this cell"
			class="flex h-[3rem] w-[3rem] items-center justify-center bg-zinc-925 text-zinc-50/50 transition-colors hover:text-zinc-50"
		>
			<SolarEyeBoldDuotone />
		</button>
		<button
			aria-label="Delete this cell"
			onclick={deleteActiveCell}
			class="flex h-[3rem] w-[3rem] items-center justify-center bg-zinc-925 text-zinc-50/50 transition-colors hover:bg-red-500 hover:text-zinc-50"
		>
			<SolarTrashBin2BoldDuotone />
		</button>
		<button
			aria-label="Close this cell"
			onclick={() => {
				editTitle = false;
				sidebar.close();
				setTimeout(() => {
					cell.active = undefined;
					cell.activeIdx = -1;
				}, 250);
			}}
			class="flex h-[3rem] w-[3rem] items-center justify-center bg-zinc-925 text-zinc-50/50 transition-colors hover:text-zinc-50"
		>
			<MaterialSymbolsCloseRounded height={22} width={22} />
		</button>
	</div>
</aside>

<style>
	.transition-height {
		transition: height 350ms cubic-bezier(0.625, 0.05, 0, 1);
		will-change: height;
	}
</style>
