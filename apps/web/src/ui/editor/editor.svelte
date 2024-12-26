<script lang="ts">
	import { branch } from '$lib/stores/branch.svelte';
	import { Editor, type Content } from '@tiptap/core';
	import Placeholder from '@tiptap/extension-placeholder';
	import TaskItem from '@tiptap/extension-task-item';
	import TaskList from '@tiptap/extension-task-list';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';

	let element = $state<Element | undefined>();
	let editor = $state<Editor | undefined>();

	type Props = {
		content?: Content;
		cellIdx: number;
	};

	let { content, cellIdx }: Props = $props();

	function onBlur() {
		branch.cells[cellIdx].content = editor?.getJSON();
	}

	onMount(() => {
		editor = new Editor({
			element: element,
			onBlur: onBlur,
			content: content,
			extensions: [
				StarterKit.configure({
					dropcursor: false,
					gapcursor: false
				}),
				Placeholder.configure({ placeholder: "Write something, or press '/' for commands..." }),
				TaskList,
				TaskItem.configure({
					nested: true,
					HTMLAttributes: {
						class: 'editor--task-item'
					}
				})
			],
			onTransaction: () => {
				editor = editor;
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div bind:this={element}></div>

<style lang="postcss">
	:global(.tiptap) {
		@apply mt-4;

		:global(h1) {
			@apply text-4xl font-bold;
		}

		:global(h2) {
			@apply text-3xl font-bold;
		}

		:global(h3) {
			@apply text-2xl font-semibold;
		}

		:global(h4) {
			@apply text-xl font-semibold;
		}

		:global(h5) {
			@apply font-semibold;
		}

		:global(p.is-editor-empty:first-child::before) {
			content: attr(data-placeholder);
			float: left;
			height: 0;
			pointer-events: none;
			@apply text-zinc-50/30;
		}

		:global(p) {
			margin-top: 0.5rem;
		}

		:global(p.is-empty::before) {
			content: attr(data-placeholder);
			float: left;
			height: 0;
			pointer-events: none;
			@apply text-zinc-50/30;
		}
	}

	:global(.ProseMirror-focused) {
		@apply outline-none;
	}

	:global(.editor--task-item) {
		@apply mt-[0.5rem] flex gap-x-2;
		:global(label input[type='checkbox']) {
			@apply relative rounded-[5px] border-2 border-zinc-50 bg-transparent hover:cursor-pointer;
		}

		:global(label input[type='checkbox']::before) {
			content: '';
			@apply absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-[2px] bg-transparent transition-all duration-75;
		}

		:global(label input[type='checkbox']:checked::before) {
			content: '';
			@apply scale-100 bg-sky-400;
		}

		:global(label input[type='checkbox']:checked) {
			background-image: none;
			@apply border-2 border-sky-400 bg-transparent;
		}

		:global(div) {
			@apply min-w-[1px];
		}

		:global(div p) {
			@apply mt-[1px];
		}
	}
</style>
