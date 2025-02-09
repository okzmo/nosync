<script lang="ts">
	import { ContextMenu } from 'bits-ui';
	// import SolarShareBoldDuotone from '~icons/solar/share-bold-duotone';
	import SolarTrashBinMinimalistic2BoldDuotone from '~icons/solar/trash-bin-minimalistic-2-bold-duotone';
	import SolarFileSendBoldDuotone from '~icons/solar/file-send-bold-duotone';
	import SolarCloudDownloadBoldDuotone from '~icons/solar/cloud-download-bold-duotone';
	import { cell } from '$lib/stores/cell.svelte';

	let { elementId, idx } = $props();
</script>

<ContextMenu.Content
	class="z-50 w-full min-w-[150px] border border-zinc-50/10 bg-zinc-800/70 p-1 outline-none backdrop-blur-xl"
>
	<ContextMenu.Item
		class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15"
	>
		<SolarCloudDownloadBoldDuotone height={16} width={16} />
		<div class="flex items-center">Download</div>
	</ContextMenu.Item>
	<ContextMenu.Item
		class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15"
	>
		<SolarFileSendBoldDuotone height={16} width={16} />
		<div class="flex items-center">Move to</div>
	</ContextMenu.Item>
	<!-- <ContextMenu.Item -->
	<!-- 	class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15" -->
	<!-- > -->
	<!-- 	<SolarShareBoldDuotone height={16} width={16} /> -->
	<!-- 	<div class="flex items-center">Share</div> -->
	<!-- </ContextMenu.Item> -->
	<ContextMenu.Item
		class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-red-500 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-red-500"
		onclick={() => cell.delete(elementId, idx)}
	>
		<SolarTrashBinMinimalistic2BoldDuotone height={16} width={16} />
		<div class="flex items-center">Delete</div>
	</ContextMenu.Item>
</ContextMenu.Content>
