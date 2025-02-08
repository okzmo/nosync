<script lang="ts">
	import { branch } from '$lib/stores/branch.svelte';
	import { space } from '$lib/stores/space.svelte';
	import { fade } from 'svelte/transition';

	let { separatorEl = $bindable(), branchEl = $bindable(), separatorPos, branchPos } = $props();
	let branchInput = $state<HTMLInputElement | undefined>();

	async function handleCreateBranch(e: SubmitEvent) {
		if (!branchInput) return;
		e.preventDefault();

		branch.create(branchInput!.value);
	}

	function activateBranchChange() {
		if (space.changingSpace) space.changingSpace = false;

		branch.changingBranch = true;
		setTimeout(() => {
			if (branchInput) branchInput.focus();
		}, 0);
	}
</script>

{#if !space.changingSpace}
	<span
		class="absolute top-[0.025rem] text-zinc-50/50"
		bind:this={separatorEl}
		transition:fade={{ duration: 75 }}
		style="left: {separatorPos}px">/</span
	>
	<li
		transition:fade={{ duration: 75 }}
		class="absolute -top-[0.05rem]"
		bind:this={branchEl}
		style="left: {branchPos}px"
	>
		{#if branch.changingBranch}
			<form transition:fade={{ duration: 75 }} onsubmit={handleCreateBranch}>
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
				onclick={activateBranchChange}
				transition:fade={{ duration: 75 }}
			>
				{space.currentBranch?.name}
			</button>
		{/if}
	</li>
{/if}
