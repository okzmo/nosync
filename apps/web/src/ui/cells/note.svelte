<script lang="ts">
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { cell } from '$lib/stores/cell.svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import type { TNote } from '$lib/types/space';
	import { generateHTML } from '@tiptap/core';
	import TaskItem from '@tiptap/extension-task-item';
	import TaskList from '@tiptap/extension-task-list';
	import StarterKit from '@tiptap/starter-kit';

	type Props = {
		note: TNote;
		i: number;
	};
	let { note, i }: Props = $props();
</script>

<button
	onclick={() => {
		backdrop.open();
		panel.open();
	}}
	onmouseover={() => {
		cell.activeIdx = i;
		cell.active = note;
	}}
	onfocus={() => {
		cell.activeIdx = i;
		cell.active = note;
	}}
	class="group absolute flex flex-col items-start justify-start overflow-hidden rounded-2xl border border-zinc-50/10 bg-zinc-900 px-6 py-4 transition-colors after:absolute after:left-0 after:top-0 after:h-full after:w-full after:content-normal after:bg-gradient-to-t after:from-zinc-900 after:to-transparent hover:border-zinc-50/30 active:border-zinc-50/20"
	style="height: {note.height}px; width: {note.width}px; transform: translate({note.x}px, {note.y}px);"
>
	<h3 class="text-2xl font-semibold">{note.title}</h3>
	{#if note.content}
		<div class="note-block mt-2">
			{@html generateHTML(note.content, [
				StarterKit,
				TaskList,
				TaskItem.configure({
					nested: true,
					HTMLAttributes: {
						class: 'editor--task-item'
					}
				})
			])}
		</div>
	{:else}
		<p class="mt-1 text-zinc-50/30">No content yet...</p>
	{/if}
</button>

<style lang="postcss">
	.note-block {
		:global(h1) {
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
		}
	}
</style>
