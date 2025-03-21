<script lang="ts">
	import { cell } from '$lib/stores/cell.svelte';
	import { sidebar } from '$lib/stores/sidebar.svelte';
	import { debounce } from '$lib/utils/debounce';
	import { Editor, type Content } from '@tiptap/core';
	import Placeholder from '@tiptap/extension-placeholder';
	import TaskItem from '@tiptap/extension-task-item';
	import TaskList from '@tiptap/extension-task-list';
	import StarterKit from '@tiptap/starter-kit';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import { onDestroy, onMount } from 'svelte';
	import { twJoin } from 'tailwind-merge';
	import { lowlight } from './editor.svelte';

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
		if (!sidebar.editorFocusmode) return;
		cell.saveContent(
			sidebar.editorFocusmode.getJSON(),
			sidebar.editorFocusmode.getText().replaceAll('\n', ' ')
		);
		typing = false;
	}

	function onUpdate() {
		typing = true;
		debounce(saveOnUpdate, 1000);
	}

	async function saveOnUpdate() {
		if (!sidebar.editorFocusmode) return;
		await cell.saveContent(
			sidebar.editorFocusmode.getJSON(),
			sidebar.editorFocusmode.getText().replaceAll('\n', ' ')
		);
	}

	onMount(() => {
		sidebar.editorFocusmode = new Editor({
			element: element,
			onBlur: onBlur,
			onUpdate: onUpdate,
			content: content?.content,
			editorProps: {
				attributes: {
					spellcheck: 'false',
					autocomplete: 'false',
					autocorrect: 'false',
					autocapitalize: 'false'
				}
			},
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
				}),
				CodeBlockLowlight.configure({
					lowlight,
					HTMLAttributes: {
						class: 'focusEditor--code-block'
					}
				})
			],
			onTransaction: () => {
				sidebar.editorFocusmode = sidebar.editorFocusmode;
			}
		});
	});

	onDestroy(() => {
		if (sidebar.editorFocusmode) {
			sidebar.editorFocusmode.destroy();
		}
	});

	$effect(() => {
		sidebar.editorFocusmode?.commands.setContent(content?.content || null);
	});
</script>

<div
	class={twJoin('[&>div]!pb-8 flex-1 overflow-y-auto [&>div]:!bg-transparent [&>div]:!p-0')}
	bind:this={element}
></div>
