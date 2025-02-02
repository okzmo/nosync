<script lang="ts">
	import { ContextMenu } from 'bits-ui';
	import { cell } from '$lib/stores/cell.svelte';
	import type { TNote } from '$lib/types/space';
	import { generateHTML } from '@tiptap/core';
	import TaskItem from '@tiptap/extension-task-item';
	import TaskList from '@tiptap/extension-task-list';
	import StarterKit from '@tiptap/starter-kit';
	import SolarShareBoldDuotone from '~icons/solar/share-bold-duotone';
	import SolarTrashBinMinimalistic2BoldDuotone from '~icons/solar/trash-bin-minimalistic-2-bold-duotone';
	import { panel } from '$lib/stores/panel.svelte';

	type Props = {
		note: TNote;
		i: number;
	};
	let { note, i }: Props = $props();

	let content = $state('');
	let isEmpty = $state(false);

	$effect(() => {
		if (note.content) {
			content = generateHTML(note.content, [
				StarterKit,
				TaskList,
				TaskItem.configure({
					nested: true,
					HTMLAttributes: {
						class: 'editor--task-item'
					}
				})
			]);
			isEmpty = content.length === '<p></p>'.length;
		}
	});
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<button
			onclick={() => {
				cell.activeIdx = i;
				cell.active = note;
				panel.open();
			}}
			class="group absolute flex flex-col items-start justify-start overflow-hidden bg-zinc-925 px-6 py-4 shadow-xl transition-colors after:absolute after:left-0 after:top-0 after:h-full after:w-full after:content-normal after:bg-gradient-to-t after:from-zinc-925 after:to-transparent hover:bg-zinc-900"
			style="height: {note.height}px; width: {note.width}px; transform: translate({note.x}px, {note.y}px);"
		>
			<h3 class="w-[10rem] shrink-0 truncate text-left text-xl font-semibold">{note.title}</h3>
			{#if note.content && !isEmpty}
				<div class="note-block mt-2" tabindex="-1" aria-readonly="true" contenteditable="false">
					{@html content}
				</div>
			{:else}
				<p class="mt-1 text-zinc-50/30">No content yet...</p>
			{/if}
		</button>
	</ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenu.Content
			class="z-50 w-full min-w-[150px] rounded-xl border border-zinc-50/10 bg-zinc-800/70 p-1 outline-none backdrop-blur-xl"
		>
			<ContextMenu.Item
				class="flex h-10 max-h-[35px] select-none items-center gap-x-2 rounded-lg pl-2 pr-3 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15"
			>
				<SolarShareBoldDuotone height={16} width={16} />
				<div class="flex items-center">Share</div>
			</ContextMenu.Item>
			<ContextMenu.Item
				class="flex h-10 max-h-[35px] select-none items-center gap-x-2 rounded-lg pl-2 pr-3 font-medium text-red-500 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-red-500"
				onclick={() => cell.delete(note.id, i)}
			>
				<SolarTrashBinMinimalistic2BoldDuotone height={16} width={16} />
				<div class="flex items-center">Delete</div>
			</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Portal>
</ContextMenu.Root>

<style lang="postcss">
	.note-block {
		pointer-events: none;
		user-select: none;

		:global(*) {
			pointer-events: none;
			user-select: none;
			outline: none;
		}

		:global(h1, h2, h3, h4, h5, h6) {
			margin-top: 0.5rem;
			text-align: left;
			font-weight: bold;
		}

		:global(p) {
			text-align: left;
		}

		:global([data-type='taskList']) {
			margin-top: 0.3rem;
		}

		:global(.editor--task-item) {
			margin-top: 0.2rem;
			pointer-events: none;
		}
	}
</style>
