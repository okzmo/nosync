<script lang="ts">
	import { cell } from '$lib/stores/cell.svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import { debounce } from '$lib/utils/debounce';
	import { Editor, type Content } from '@tiptap/core';
	import Placeholder from '@tiptap/extension-placeholder';
	import TaskItem from '@tiptap/extension-task-item';
	import TaskList from '@tiptap/extension-task-list';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';

	let element = $state<Element | undefined>();

	type Props = {
		content?: {
			id: string;
			content?: Content;
		};
		saving: string;
	};

	let { content, saving = $bindable() }: Props = $props();

	function onBlur() {
		if (!panel.editor) return;
		cell.saveContent(panel.editor.getJSON());
		panel.close();
	}

	function onUpdate() {
		saving = 'saving';
		debounce(saveOnUpdate, 1000);
	}

	async function saveOnUpdate() {
		if (!panel.editor) return;
		await cell.saveContent(panel.editor.getJSON());
		saving = 'saved';
		setTimeout(() => {
			saving = 'onhold';
		}, 2000);
	}

	onMount(() => {
		panel.editor = new Editor({
			element: element,
			onBlur: onBlur,
			onUpdate: onUpdate,
			content: content?.content,
			extensions: [
				StarterKit.configure({
					dropcursor: false,
					gapcursor: false
				}),
				Placeholder.configure({ placeholder: 'Write something...' }),
				TaskList,
				TaskItem.configure({
					nested: true,
					HTMLAttributes: {
						class: 'editor--task-item'
					}
				})
			],
			onTransaction: () => {
				panel.editor = panel.editor;
			}
		});
	});

	onDestroy(() => {
		if (panel.editor) {
			panel.editor.destroy();
		}
	});

	$effect(() => {
		panel.editor?.commands.setContent(content?.content || null);
	});
</script>

<div class="flex-1 overflow-y-auto" bind:this={element}></div>

<style lang="postcss">
	:global(.tiptap) {
		@apply h-full overflow-y-auto bg-zinc-925 p-3;

		scroll-padding-block: 16px;

		:global(& > *) {
			margin-top: 0.5rem;
		}

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
			@apply scale-100 bg-[#F29C51];
		}

		:global(label input[type='checkbox']:checked) {
			background-image: none;
			@apply border-2 border-[#F29C51] bg-transparent;
		}

		:global(div) {
			@apply min-w-[1px];
		}

		:global(div p) {
			@apply mt-[1px];
		}
	}
</style>
