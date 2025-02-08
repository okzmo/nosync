<script lang="ts">
	import { space } from '$lib/stores/space.svelte';
	import { fade } from 'svelte/transition';
	import BreadcrumbsSpace from './breadcrumbs-space.svelte';
	import BreadcrumbsBranch from './breadcrumbs-branch.svelte';

	let branchEl = $state<HTMLElement | undefined>();
	let spaceEl = $state<HTMLElement | undefined>();
	let separatorEl = $state<HTMLElement | undefined>();

	let spaceDimensions = $derived.by(() => {
		if (space.currentSpace) {
			return spaceEl?.getBoundingClientRect();
		}
	});
	let separatorDimensions = $derived.by(() => {
		if (space.currentSpace) {
			return separatorEl?.getBoundingClientRect();
		}
	});

	let branchPosition = $derived.by(() => {
		if (!spaceDimensions || !separatorDimensions) return 0;
		return spaceDimensions.width + separatorDimensions.width + 20;
	});
	let separatorPosition = $derived.by(() => {
		if (!spaceDimensions) return 0;
		return spaceDimensions.width + 10;
	});
</script>

<ul
	class="relative z-[1] flex gap-x-3 font-serif text-lg italic"
	transition:fade={{ duration: 45 }}
>
	<BreadcrumbsSpace bind:spaceEl />
	<BreadcrumbsBranch
		bind:separatorEl
		bind:branchEl
		separatorPos={separatorPosition}
		branchPos={branchPosition}
	/>
</ul>
