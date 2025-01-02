<script lang="ts">
	import { space } from '$lib/stores/space.svelte';
	import { branch } from '$lib/stores/branch.svelte';
	import { fade } from 'svelte/transition';

	let spaceInput = $state<HTMLInputElement | undefined>();
	let branchInput = $state<HTMLInputElement | undefined>();
	let spaceEl = $state<HTMLElement | undefined>();
	let separatorEl = $state<HTMLElement | undefined>();
	let branchEl = $state<HTMLElement | undefined>();

	function activateSpaceChange() {
		if (branch.changingBranch) branch.changingBranch = false;

		space.changingSpace = true;
		setTimeout(() => {
			if (spaceInput) spaceInput.focus();
		}, 0);
	}

	function activateBranchChange() {
		if (space.changingSpace) space.changingSpace = false;

		branch.changingBranch = true;
		setTimeout(() => {
			if (branchInput) branchInput.focus();
		}, 0);
	}

	async function handleCreateSpace(e: SubmitEvent) {
		if (!spaceInput) return;
		e.preventDefault();

		space.create(spaceInput!.value);
	}

	async function handleCreateBranch(e: SubmitEvent) {
		if (!branchInput) return;
		e.preventDefault();

		branch.create(branchInput!.value);
	}

	$effect(() => {
		if (!space.changingSpace) {
			const spaceSize = spaceEl?.getBoundingClientRect();
			const separatorSize = separatorEl?.getBoundingClientRect();
			if (spaceSize && separatorSize && separatorEl && branchEl) {
				separatorEl.style.left = `${spaceSize.width + 10}px`;
				branchEl.style.left = `${spaceSize.width + separatorSize.width + 20}px`;
			}
		}
	});
</script>

<ul
	class="relative z-[1] flex gap-x-3 font-serif text-lg italic"
	transition:fade={{ duration: 75 }}
>
	<li bind:this={spaceEl}>
		{#if space.changingSpace}
			<form onsubmit={handleCreateSpace}>
				<input
					type="text"
					placeholder={space.currentSpace?.name}
					class="w-fit border-none bg-transparent p-0 text-lg italic text-zinc-50 placeholder:text-zinc-50/50 focus:outline-none focus:ring-0"
					bind:this={spaceInput}
				/>
			</form>
		{:else}
			<button class="italic text-zinc-50/50" onclick={activateSpaceChange}
				>{space.currentSpace?.name}</button
			>
		{/if}
	</li>
	{#if !space.changingSpace}
		<span
			class="absolute top-[0.025rem] text-zinc-50/50"
			bind:this={separatorEl}
			transition:fade={{ duration: 75 }}>/</span
		>
		<li transition:fade={{ duration: 75 }} class="absolute -top-[0.05rem]" bind:this={branchEl}>
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
</ul>
