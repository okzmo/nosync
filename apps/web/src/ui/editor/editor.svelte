<script lang="ts">
	import { cell } from '$lib/stores/cell.svelte';
	import { sidebar } from '$lib/stores/sidebar.svelte';
	import { debounce } from '$lib/utils/debounce';
	import { Editor, type JSONContent } from '@tiptap/core';
	import Placeholder from '@tiptap/extension-placeholder';
	import TaskItem from '@tiptap/extension-task-item';
	import TaskList from '@tiptap/extension-task-list';
	import StarterKit from '@tiptap/starter-kit';
	import { onDestroy, onMount } from 'svelte';
	import { twJoin } from 'tailwind-merge';

	let element = $state<Element | undefined>();

	type Props = {
		content?: JSONContent;
		saving: string;
		transparent?: boolean;
		typing?: boolean;
	};

	let { content, transparent, saving = $bindable(), typing = $bindable() }: Props = $props();

	function onBlur() {
		if (!sidebar.editor) return;
		cell.saveContent(sidebar.editor.getJSON(), sidebar.editor.getText().replaceAll('\n', ' '));
		typing = false;
	}

	function onUpdate() {
		saving = 'saving';
		typing = true;
		debounce(saveOnUpdate, 1000);
	}

	async function saveOnUpdate() {
		if (!sidebar.editor) return;
		if (cell.active?.content) cell.active.content = sidebar.editor.getJSON();
		await cell.saveContent(
			sidebar.editor.getJSON(),
			sidebar.editor.getText().replaceAll('\n', ' ')
		);
		saving = 'saved';
		setTimeout(() => {
			saving = 'onhold';
		}, 2000);
	}

	onMount(() => {
		sidebar.editor = new Editor({
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
				sidebar.editor = sidebar.editor;
			}
		});
	});

	onDestroy(() => {
		if (sidebar.editor) {
			sidebar.editor.destroy();
		}
	});

	$effect(() => {
		sidebar.editor?.commands.setContent(content?.content || null);
	});
</script>

<div
	class={twJoin(
		'flex-1 overflow-y-auto',
		transparent && '[&>div]:!bg-transparent [&>div]:!p-0 [&>div]:!pb-8'
	)}
	bind:this={element}
></div>

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
			@apply scale-100 bg-accent;
		}

		:global(label input[type='checkbox']:checked) {
			background-image: none;
			@apply border-2 border-accent bg-transparent;
		}

		:global(div) {
			@apply min-w-[1px];
		}

		:global(div p) {
			@apply mt-[1px];
		}
	}
</style>
