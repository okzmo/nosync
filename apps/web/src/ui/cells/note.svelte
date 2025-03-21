<script lang="ts">
	import { ContextMenu } from 'bits-ui';
	import { cell } from '$lib/stores/cell.svelte';
	import type { TNote } from '$lib/types/space';
	import { generateHTML } from '@tiptap/core';
	import TaskItem from '@tiptap/extension-task-item';
	import TaskList from '@tiptap/extension-task-list';
	import StarterKit from '@tiptap/starter-kit';
	import { sidebar } from '$lib/stores/sidebar.svelte';
	import ContextMenuCell from './context-menu-cell.svelte';

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
				StarterKit.configure({
					bulletList: {
						HTMLAttributes: {
							class: 'editor--bullet-item'
						}
					}
				}),
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
				sidebar.open();
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
		<ContextMenuCell elementId={note.id} idx={i} type="note" />
	</ContextMenu.Portal>
</ContextMenu.Root>

<style lang="postcss">
	.note-block {
		pointer-events: none;
		user-select: none;
		width: 100%;
		height: 100%;
		overflow: hidden;

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

		:global(.editor--bullet-item li) {
			width: 100%;
			position: relative;
			padding-left: 12px;
		}

		:global(.editor--bullet-item li::before) {
			position: absolute;
			left: 0;
			top: 0.65rem;
			content: '';
			height: 5px;
			width: 5px;
			background-color: #ec5a5a;
			border-radius: 50%;
		}

		:global([data-type='taskList']) {
			margin-top: 0.3rem;
		}

		:global(.editor--task-item) {
			margin-top: 0.2rem;
			pointer-events: none;
		}

		:global(code) {
			@apply border border-zinc-800 bg-zinc-900 px-3 py-2;
		}

		:global(pre code) {
			@apply block;
		}
	}
</style>
