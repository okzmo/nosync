<script lang="ts">
	import { Label, FieldErrors } from 'formsnap';
	import type { Component } from 'svelte';
	import { twJoin } from 'tailwind-merge';

	type Props = {
		props: any;
		input: any;
		inputError: boolean | undefined;
		value: string;
		label: string;
		placeholder: string;
		Icon?: Component;
		classes?: string;
		type: 'email' | 'password' | 'text';
	};

	let {
		label,
		type,
		placeholder,
		props,
		inputError,
		input = $bindable(),
		value = $bindable(),
		Icon,
		classes
	}: Props = $props();
</script>

<div class={twJoin('flex items-center gap-x-1', classes)}>
	<Label
		class={twJoin('pl-2 text-sm text-zinc-50/35 transition-colors', inputError && '!text-red-500')}
	>
		{label}
	</Label>
	{#if inputError}
		<span class="block text-sm text-red-500">-</span>
	{/if}
	<FieldErrors class="text-sm text-red-500" />
</div>
<div
	class={twJoin(
		'relative mt-[0.35rem] overflow-hidden border border-zinc-50/15 transition-colors',
		Icon && 'pl-9'
	)}
>
	<Icon
		class={twJoin('absolute left-4 top-1/2 -translate-y-1/2 text-zinc-50/35 transition-colors')}
		height={22}
		width={22}
	/>
	<input
		class="w-full border-none bg-zinc-950 px-4 py-3 placeholder:text-zinc-50/35 focus:outline-none focus:ring-0"
		{...props}
		{placeholder}
		{type}
		bind:this={input}
		bind:value
	/>
</div>
