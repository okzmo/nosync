<script lang="ts">
	import { ContextMenu } from 'bits-ui';
	// import SolarShareBoldDuotone from '~icons/solar/share-bold-duotone';
	import SolarTrashBinMinimalistic2BoldDuotone from '~icons/solar/trash-bin-minimalistic-2-bold-duotone';
	import SolarFileSendBoldDuotone from '~icons/solar/file-send-bold-duotone';
	import SolarCloudDownloadBoldDuotone from '~icons/solar/cloud-download-bold-duotone';
	import SolarAltArrowRightLineDuotone from '~icons/solar/alt-arrow-right-line-duotone';
	import SolarGlobalBoldDuotone from '~icons/solar/global-bold-duotone';
	import SolarCopyBoldDuotone from '~icons/solar/copy-bold-duotone';
	import { cell } from '$lib/stores/cell.svelte';
	import { space } from '$lib/stores/space.svelte';

	interface ContextMenuProps {
		type: 'photo' | 'video' | 'note' | 'pdf';
		elementId: string;
		originalUrl?: string;
		sourceUrl?: string | null;
		idx: number;
	}

	let { type, elementId, originalUrl, sourceUrl, idx }: ContextMenuProps = $props();

	function handleMoveTo(branchId: string) {
		cell.moveTo(elementId, idx, branchId);
	}

	function handleDownload() {
		const fileName = originalUrl?.split('/').pop();
		if (!fileName || !originalUrl) return;

		const a = document.createElement('a');
		a.href = `${originalUrl}?response-content-disposition=attachment`;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	async function copyImageToClipboard() {
		if (!originalUrl) return;

		const img = new Image();
		img.crossOrigin = 'anonymous';
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		await new Promise((resolve: (value: void) => void) => {
			img.onload = () => {
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				ctx?.drawImage(img, 0, 0);
				resolve();
			};
			img.src = originalUrl;
		});

		const blob = (await new Promise((resolve) =>
			canvas.toBlob((b) => resolve(b), 'image/png')
		)) as Blob | null;

		try {
			navigator.clipboard.write([
				new ClipboardItem({
					'image/png': blob ? blob : ''
				})
			]);
		} catch (err) {
			console.error(err);
		}
	}

	function handleGotoSource() {
		if (!sourceUrl) return;
		window.open(sourceUrl, '_blank');
	}
</script>

<ContextMenu.Content
	class="blurred-bg z-50 w-full min-w-[185px] border border-zinc-50/10  p-1 outline-none"
>
	{#if originalUrl}
		{#if type === 'photo'}
			<ContextMenu.Item
				class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15"
				onclick={copyImageToClipboard}
			>
				<SolarCopyBoldDuotone height={16} width={16} />
				<div class="flex items-center">Copy image</div>
			</ContextMenu.Item>
		{/if}
		<ContextMenu.Item
			class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15"
			onclick={handleDownload}
		>
			<SolarCloudDownloadBoldDuotone height={16} width={16} />
			<div class="flex items-center">Download</div>
		</ContextMenu.Item>
	{/if}
	{#if sourceUrl}
		<ContextMenu.Item
			class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15"
			onclick={handleGotoSource}
		>
			<SolarGlobalBoldDuotone height={16} width={16} />
			<div class="flex items-center">Go to source</div>
		</ContextMenu.Item>
	{/if}
	{#if space.currentSpace?.branches && space.currentSpace?.branches?.length > 1}
		<ContextMenu.Sub>
			<ContextMenu.SubTrigger
				class="flex h-10 max-h-[35px] select-none items-center justify-between pl-2 pr-1 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15"
			>
				<div class="flex items-center gap-x-2">
					<SolarFileSendBoldDuotone height={16} width={16} />
					<div class="flex items-center">Move to</div>
				</div>
				<SolarAltArrowRightLineDuotone height={14} width={14} />
			</ContextMenu.SubTrigger>
			<ContextMenu.SubContent
				class="z-50 w-full min-w-[150px] border border-zinc-50/10 bg-zinc-800/70 p-1 outline-none backdrop-blur-xl"
				sideOffset={10}
				align="start"
			>
				{#each space.currentSpace?.branches.filter((b) => b.id !== space.currentBranch!.id) as branch}
					<ContextMenu.Item
						class="flex h-10 max-h-[35px] select-none items-center gap-x-2  pl-2 pr-3 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15"
						onclick={() => handleMoveTo(branch.id)}
					>
						{branch.name}
					</ContextMenu.Item>
				{/each}
			</ContextMenu.SubContent>
		</ContextMenu.Sub>
	{/if}
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

<style lang="postcss">
	:global(.blurred-bg::after) {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		background-color: red;
		width: 100%;
		height: 100%;
		z-index: -1;
		@apply bg-zinc-800/70 backdrop-blur-2xl;
	}
</style>
