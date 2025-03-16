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
	import { twJoin } from 'tailwind-merge';

	let element = $state<Element | undefined>();

	type Props = {
		content?: {
			id: string;
			content?: Content;
		};
		typing?: boolean;
	};

	let { content, typing = $bindable() }: Props = $props();
	$inspect(content);

	function onBlur() {
		if (!panel.editorFocusmode) return;
		cell.saveContent(
			panel.editorFocusmode.getJSON(),
			panel.editorFocusmode.getText().replaceAll('\n', ' ')
		);
		typing = false;
	}

	function onUpdate() {
		typing = true;
		debounce(saveOnUpdate, 1000);
	}

	async function saveOnUpdate() {
		if (!panel.editorFocusmode) return;
		await cell.saveContent(
			panel.editorFocusmode.getJSON(),
			panel.editorFocusmode.getText().replaceAll('\n', ' ')
		);
	}

	onMount(() => {
		panel.editorFocusmode = new Editor({
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
				panel.editorFocusmode = panel.editorFocusmode;
			}
		});
	});

	onDestroy(() => {
		if (panel.editorFocusmode) {
			panel.editorFocusmode.destroy();
		}
	});

	$effect(() => {
		panel.editorFocusmode?.commands.setContent(content?.content || null);
	});
</script>

<div
	class={twJoin('[&>div]!pb-8 flex-1 overflow-y-auto [&>div]:!bg-transparent [&>div]:!p-0')}
	bind:this={element}
></div>
