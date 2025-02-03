<script lang="ts">
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { cell } from '$lib/stores/cell.svelte';
	import { panel } from '$lib/stores/panel.svelte';
	import type { TPDF } from '$lib/types/space';
	import { ContextMenu } from 'bits-ui';
	import SolarPenNewSquareBoldDuotone from '~icons/solar/pen-new-square-bold-duotone';
	import SolarShareBoldDuotone from '~icons/solar/share-bold-duotone';
	import SolarTrashBinMinimalistic2BoldDuotone from '~icons/solar/trash-bin-minimalistic-2-bold-duotone';
	import SolarMaximizeBold from '~icons/solar/maximize-bold';
	import { getPDFFirstPage } from '$lib/utils/media';
	import { onMount } from 'svelte';

	let pdfUrl = $state('');

	type Props = {
		pdf: TPDF;
		i: number;
	};
	let { pdf, i }: Props = $props();

	onMount(async () => {
		const url = await getPDFFirstPage({ pdfURL: pdf.originalUrl });
		pdfUrl = url === '' ? pdf.blurUrl : url;
	});
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<div
			role="button"
			tabindex="0"
			onclick={() => {
				cell.activeIdx = i;
				cell.active = pdf;
				panel.open();
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					cell.activeIdx = i;
					cell.active = pdf;
					panel.open();
				}
			}}
			class="group absolute overflow-hidden bg-zinc-925 shadow-xl before:absolute before:inset-0 before:content-normal before:bg-gradient-to-t before:from-zinc-950/50 before:to-transparent before:opacity-0 before:transition-opacity before:duration-75 hover:before:opacity-100 active:before:opacity-80"
			style="height: {pdf.height}px; width: {pdf.width}px; transform: translate({pdf.x}px, {pdf.y}px);"
		>
			{#if pdf.title}
				<h3
					class="absolute bottom-3 left-5 font-serif text-xl italic opacity-0 transition-opacity group-hover:opacity-100"
				>
					{pdf.title}
				</h3>
			{/if}

			<img src={pdfUrl} alt="" />

			{#if pdf.content?.content?.[0]?.content}
				<SolarPenNewSquareBoldDuotone
					class="absolute right-3 top-3 text-zinc-50/40 transition-colors group-hover:text-zinc-50"
					height={20}
					width={20}
				/>
			{/if}

			<button
				aria-label="Maximize the picture"
				tabindex="-1"
				onclick={(e) => {
					e.stopPropagation();
					cell.maximized = pdf;
					backdrop.open();
				}}
				class="absolute left-2 top-2 bg-zinc-950 p-2 text-zinc-50/30 opacity-100 transition-all duration-75 hover:text-zinc-50 active:text-zinc-50/90 group-hover:opacity-100 lg:opacity-0"
			>
				<SolarMaximizeBold height={16} width={16} />
			</button>
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenu.Content
			class="z-50 w-full min-w-[150px] rounded-xl border border-zinc-50/10 bg-zinc-800/70 p-1 outline-none backdrop-blur-xl"
		>
			<ContextMenu.Item
				class="flex h-10 max-h-[35px] select-none items-center gap-x-2 rounded-lg pl-2 pr-3 font-medium text-zinc-50/50 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-zinc-50/15"
			>
				<SolarShareBoldDuotone height={16} width={16} />
				<div class="flex items-center">Share</div>
			</ContextMenu.Item>
			<ContextMenu.Item
				class="flex h-10 max-h-[35px] select-none items-center gap-x-2 rounded-lg pl-2 pr-3 font-medium text-red-500 transition-colors duration-75 hover:cursor-pointer hover:text-zinc-50 data-[highlighted]:bg-red-500"
				onclick={() => cell.delete(pdf.id, i)}
			>
				<SolarTrashBinMinimalistic2BoldDuotone height={16} width={16} />
				<div class="flex items-center">Delete</div>
			</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Portal>
</ContextMenu.Root>
