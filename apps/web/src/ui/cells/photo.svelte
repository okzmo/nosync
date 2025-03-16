<script lang="ts">
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { cell } from '$lib/stores/cell.svelte';
	import { sidebar } from '$lib/stores/sidebar.svelte';
	import type { TPhoto } from '$lib/types/space';
	import { ContextMenu } from 'bits-ui';
	import SolarPenNewSquareBoldDuotone from '~icons/solar/pen-new-square-bold-duotone';
	import SolarMaximizeBold from '~icons/solar/maximize-bold';
	import ContextMenuCell from './context-menu-cell.svelte';

	type Props = {
		photo: TPhoto;
		i: number;
	};
	let { photo, i }: Props = $props();
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<div
			role="button"
			tabindex="0"
			onclick={() => {
				cell.activeIdx = i;
				cell.active = photo;
				sidebar.open();
			}}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					cell.activeIdx = i;
					cell.active = photo;
					sidebar.open();
				}
			}}
			class="group absolute overflow-hidden shadow-xl before:absolute before:inset-0 before:content-normal before:bg-gradient-to-t before:from-zinc-950/50 before:to-transparent before:opacity-0 before:transition-opacity before:duration-75 hover:before:opacity-100 active:before:opacity-80"
			style="height: {photo.height}px; width: {photo.width}px; transform: translate({photo.x}px, {photo.y}px);"
		>
			{#if photo.resizedUrl !== ''}
				<img
					src={photo.resizedUrl}
					alt=""
					class="h-full w-full select-none border-[0px] object-cover"
					loading="lazy"
				/>
			{/if}
			<img
				alt=""
				class="absolute left-0 top-0 z-[-1] h-full w-full select-none object-cover"
				src={photo.blurUrl}
			/>
			{#if photo.title}
				<h3
					class="absolute bottom-3 left-5 font-serif text-xl italic opacity-0 transition-opacity group-hover:opacity-100"
				>
					{photo.title}
				</h3>
			{/if}

			{#if photo.content?.content?.[0]?.content}
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
					cell.maximized = photo;
					backdrop.open();
				}}
				class="absolute left-2 top-2 bg-zinc-950 p-2 text-zinc-50/30 opacity-100 transition-all duration-75 hover:text-zinc-50 active:text-zinc-50/90 group-hover:opacity-100 lg:opacity-0"
			>
				<SolarMaximizeBold height={16} width={16} />
			</button>
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenuCell
			elementId={photo.id}
			originalUrl={photo.originalUrl}
			mimeType={photo.mime}
			sourceUrl={photo.sourceUrl}
			idx={i}
		/>
	</ContextMenu.Portal>
</ContextMenu.Root>
