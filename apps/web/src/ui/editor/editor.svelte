<script lang="ts" module>
	export const lowlight = createLowlight(all);
</script>

<script lang="ts">
	import { cell } from '$lib/stores/cell.svelte';
	import { sidebar } from '$lib/stores/sidebar.svelte';
	import { debounce } from '$lib/utils/debounce';
	import { Editor, type JSONContent } from '@tiptap/core';
	import Placeholder from '@tiptap/extension-placeholder';
	import TaskItem from '@tiptap/extension-task-item';
	import TaskList from '@tiptap/extension-task-list';
	import StarterKit from '@tiptap/starter-kit';
	import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
	import { onDestroy, onMount } from 'svelte';
	import { twJoin } from 'tailwind-merge';
	import { createLowlight, all } from 'lowlight';

	let element = $state<Element | undefined>();

	type Props = {
		content?: JSONContent;
		saving: string;
		transparent?: boolean;
		typing?: boolean;
	};

	let { content, transparent, saving = $bindable(), typing = $bindable() }: Props = $props();

	function onBlur() {
		if (!sidebar.editor || saving === 'onhold') return;
		cell.saveContent(sidebar.editor.getJSON(), sidebar.editor.getText().replaceAll('\n', ' '));
		typing = false;
		if (cell.active?.content) cell.active.content = sidebar.editor.getJSON();
	}

	function onUpdate() {
		saving = 'saving';
		typing = true;
		debounce(saveOnUpdate, 1000);
	}

	async function saveOnUpdate() {
		if (!sidebar.editor) return;
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
			content: null,
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
					codeBlock: false,
					gapcursor: false,
					bulletList: {
						HTMLAttributes: {
							class: 'editor--bullet-item'
						}
					}
				}),
				CodeBlockLowlight.configure({
					lowlight
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
		if (cell.active?.id) {
			sidebar.editor?.commands.setContent(content || null);
		}
	});
</script>

<div
	spellcheck="false"
	class={twJoin(
		'flex-1 overflow-y-auto',
		transparent && '[&>div]:!bg-transparent [&>div]:!p-0 [&>div]:!pb-8'
	)}
	bind:this={element}
></div>
