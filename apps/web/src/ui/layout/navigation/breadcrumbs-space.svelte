<script lang="ts">
	import { branch } from '$lib/stores/branch.svelte';
	import { space } from '$lib/stores/space.svelte';
	import { sanitize } from '$lib/utils/string';
	import { ContextMenu } from 'bits-ui';
	import SolarTextFieldFocusBoldDuotone from '~icons/solar/text-field-focus-bold-duotone';
	import SolarTrashBinMinimalistic2BoldDuotone from '~icons/solar/trash-bin-minimalistic-2-bold-duotone';

	let spaceInput = $state<HTMLInputElement | undefined>();
	let inputValue = $state('');
	let processedValue = $derived(sanitize(inputValue, 20));
	let action = $state<'create' | 'rename'>('create');

	function handleInput() {
		if (!spaceInput) return;

		inputValue = spaceInput.value;
		spaceInput.value = processedValue;
	}

	async function handleCreateSpace(e: SubmitEvent) {
		if (!spaceInput) return;
		e.preventDefault();

		space.create(spaceInput!.value);
	}

	async function handleRenameSpace(e: SubmitEvent) {
		if (!spaceInput) return;
		e.preventDefault();

		space.rename(spaceInput!.value);
	}

	function activateSpaceChange(givenAction: typeof action) {
		if (branch.changingBranch) branch.changingBranch = false;
		action = givenAction;

		space.changingSpace = true;
		setTimeout(() => {
			if (spaceInput) spaceInput.focus();
		}, 0);
	}
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<li>
			{#if space.changingSpace}
				<form onsubmit={action === 'create' ? handleCreateSpace : handleRenameSpace}>
					<input
						type="text"
						placeholder={space.currentSpace?.name}
						class="w-fit border-none bg-transparent p-0 text-lg italic text-zinc-50 placeholder:text-zinc-50/50 focus:outline-none focus:ring-0"
						bind:this={spaceInput}
						value={processedValue}
						oninput={handleInput}
					/>
				</form>
			{:else}
				<button class="italic text-zinc-50/50" onclick={() => activateSpaceChange('create')}
					>{space.currentSpace?.name}</button
				>
			{/if}
		</li>
	</ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenu.Content
			class="z-[999] w-full min-w-[150px] border border-zinc-50/10 bg-zinc-800/70 p-1 outline-none backdrop-blur-xl"
		>
			<ContextMenu.Item
				class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15"
				onclick={() => activateSpaceChange('rename')}
			>
				<SolarTextFieldFocusBoldDuotone height={16} width={16} />
				<div class="flex items-center">Rename</div>
			</ContextMenu.Item>
			<ContextMenu.Item
				class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-red-500 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-red-500"
				onclick={() => space.delete()}
			>
				<SolarTrashBinMinimalistic2BoldDuotone height={16} width={16} />
				<div class="flex items-center">Delete</div>
			</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Portal>
</ContextMenu.Root>
