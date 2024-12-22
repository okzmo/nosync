<script lang="ts">
	import { twJoin } from 'tailwind-merge';
	import { Drawer } from 'vaul-svelte';
	import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded';
	import MaterialSymbolsOpenInFullRounded from '~icons/material-symbols/open-in-full-rounded';
	import MaterialSymbolsCloseFullscreenRounded from '~icons/material-symbols/close-fullscreen-rounded';
	import SolarTrashBin2BoldDuotone from '~icons/solar/trash-bin-2-bold-duotone';
	import { panel } from '$lib/stores/panel.svelte';
	import { backdrop } from '$lib/stores/backdrop.svelte';
	import { branch } from '$lib/stores/branch.svelte';

	let title = $state('');

	$effect(() => {
		if (branch.activeCell) {
			title = branch.activeCell.title;
		}
	});
</script>

<Drawer.Root direction="left" shouldScaleBackground={false} open={panel.isOpen} dismissible={false}>
	<Drawer.Portal>
		<Drawer.Content
			interactOutsideBehavior="ignore"
			class={twJoin(
				'widthTransition fixed bottom-0 left-0 top-0 z-[998] flex flex-col bg-zinc-950',
				panel.isFullscreen ? 'w-full' : 'w-full lg:w-[45rem] xl:w-[50rem]'
			)}
		>
			<div
				class="mx-auto flex w-full items-center justify-between px-5 pt-6 text-zinc-50/30 lg:w-[45rem] xl:w-[50rem]"
			>
				<button
					class="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:bg-red-500/15 hover:text-red-500"
				>
					<SolarTrashBin2BoldDuotone height={18} width={18} />
				</button>
				<p>October 20, 2024</p>
				<div class="flex items-center gap-x-2">
					<button
						onclick={() => panel.toggleFullscreen()}
						class="hidden h-6 w-6 items-center justify-center rounded-lg transition-colors hover:bg-zinc-50/15 hover:text-zinc-50 lg:flex"
					>
						{#if panel.isFullscreen}
							<MaterialSymbolsCloseFullscreenRounded height={18} width={18} />
						{:else}
							<MaterialSymbolsOpenInFullRounded height={18} width={18} />
						{/if}
					</button>
					<button
						onclick={() => {
							panel.close();
							panel.shrink();
							backdrop.close();
						}}
						class="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:bg-zinc-50/15 hover:text-zinc-50"
					>
						<MaterialSymbolsCloseRounded height={22} width={22} />
					</button>
				</div>
			</div>

			<div class="mx-auto mt-20 w-full px-8 md:mt-20 md:px-14 lg:w-[45rem] xl:w-[50rem]">
				<figure
					class={twJoin(
						'relative',
						branch.activeCell?.aspectRatio > 1 ? 'h-[10rem] w-[15rem]' : 'h-[15rem] w-[10rem]'
					)}
				>
					<img
						src={branch.activeCell?.url}
						alt=""
						class="h-full w-full rounded-2xl object-cover object-bottom"
					/>
					<img
						src={branch.activeCell?.url}
						alt=""
						class="absolute left-1/2 top-1/2 z-[-1] h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover blur-lg"
						role="presentation"
					/>
				</figure>
				<input
					type="text"
					class="mt-5 w-full border-b-0 border-l-0 border-r-0 border-t-0 border-zinc-50/30 bg-transparent text-5xl font-bold transition-colors placeholder:text-zinc-50/15 focus:border-zinc-50/50 focus:outline-none focus:ring-0"
					placeholder="Title"
					bind:value={title}
				/>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>

<style>
	:global(.widthTransition) {
		transition:
			transform 0.25s cubic-bezier(0.32, 0.72, 0, 1),
			width 0.25s cubic-bezier(0.32, 0.72, 0, 1) !important;
		animation-duration: 0.25s !important;
	}
</style>
