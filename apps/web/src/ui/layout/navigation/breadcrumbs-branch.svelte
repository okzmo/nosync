<script lang="ts">
	import { branch } from '$lib/stores/branch.svelte';
	import { space } from '$lib/stores/space.svelte';
	import { fade } from 'svelte/transition';
	import { ContextMenu } from 'bits-ui';
	import SolarTrashBinMinimalistic2BoldDuotone from '~icons/solar/trash-bin-minimalistic-2-bold-duotone';
	import SolarTextFieldFocusBoldDuotone from '~icons/solar/text-field-focus-bold-duotone';

	let branchInput = $state<HTMLInputElement | undefined>();
	let action = $state<'create' | 'rename'>('create');

	async function handleCreateBranch(e: SubmitEvent) {
		if (!branchInput) return;
		e.preventDefault();

		branch.create(branchInput!.value);
	}

	async function handleRenameBranch(e: SubmitEvent) {
		if (!branchInput) return;
		e.preventDefault();

		branch.rename(branchInput!.value);
	}

	function activateBranchChange(givenAction: typeof action) {
		if (space.changingSpace) space.changingSpace = false;
		action = givenAction;

		branch.changingBranch = true;
		setTimeout(() => {
			if (branchInput) branchInput.focus();
		}, 0);
	}
</script>

{#if !space.changingSpace}
	<ContextMenu.Root>
		<ContextMenu.Trigger>
			<span class="text-zinc-50/50" transition:fade={{ duration: 75 }}>/</span>
			<li transition:fade={{ duration: 75 }} class="absolute -top-[0.04rem] ml-[1rem]">
				{#if branch.changingBranch}
					<form
						transition:fade={{ duration: 75 }}
						onsubmit={action === 'create' ? handleCreateBranch : handleRenameBranch}
					>
						<input
							type="text"
							placeholder={space.currentBranch?.name}
							class="w-fit border-none bg-transparent p-0 text-lg italic text-zinc-50 placeholder:text-zinc-50/50 focus:outline-none focus:ring-0"
							bind:this={branchInput}
						/>
					</form>
				{:else}
					<button
						class="absolute top-0 italic text-zinc-50"
						onclick={() => activateBranchChange('create')}
						transition:fade={{ duration: 75 }}
					>
						{space.currentBranch?.name}
					</button>
				{/if}
			</li>
		</ContextMenu.Trigger>
		<ContextMenu.Portal>
			<ContextMenu.Content
				class="z-[999] w-full min-w-[150px] border border-zinc-50/10 bg-zinc-800/70 p-1 outline-none backdrop-blur-xl"
			>
				<ContextMenu.Item
					class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15"
					onclick={() => activateBranchChange('rename')}
				>
					<SolarTextFieldFocusBoldDuotone height={16} width={16} />
					<div class="flex items-center">Rename</div>
				</ContextMenu.Item>
				<ContextMenu.Item
					class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-red-500 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-red-500"
					onclick={() => branch.delete()}
				>
					<SolarTrashBinMinimalistic2BoldDuotone height={16} width={16} />
					<div class="flex items-center">Delete</div>
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Portal>
	</ContextMenu.Root>
{/if}
