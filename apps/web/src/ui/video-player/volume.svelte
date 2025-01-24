<script lang="ts">
	import { twJoin } from 'tailwind-merge';
	import MaterialSymbolsVolumeDownRounded from '~icons/material-symbols/volume-down-rounded';
	import MaterialSymbolsVolumeMuteRounded from '~icons/material-symbols/volume-mute-rounded';
	import MaterialSymbolsVolumeUpRounded from '~icons/material-symbols/volume-up-rounded';

	let { toggleVolume = $bindable(), volume = $bindable(), videoEl = $bindable() } = $props();

	let changingVolume = $state(false);
	let volumeBtn = $state<HTMLButtonElement | null>();
	let volumeEl = $state<HTMLDivElement | null>();

	function handleClickVolumeBtn() {
		toggleVolume = !toggleVolume;
	}

	function handleMousedownVolumeChange() {
		changingVolume = true;
	}

	function handleMousemoveVolumeChange(e: MouseEvent) {
		if (!changingVolume) return;

		const volumeRect = volumeEl!.getBoundingClientRect();
		const sliderWidth = volumeRect.width;
		const offsetX = e.clientX - volumeRect.left;

		let newVolume = Math.max(0, Math.min(1, offsetX / sliderWidth));

		volume = newVolume;
		videoEl!.volume = newVolume;
	}

	function handleMouseupVolumeChange() {
		changingVolume = false;
	}
</script>

<div
	onmousedown={(e) => {
		e.preventDefault();
		if (!toggleVolume) {
			return null;
		} else {
			return handleMousedownVolumeChange();
		}
	}}
	onmouseup={!toggleVolume ? null : handleMouseupVolumeChange}
	onmousemove={!toggleVolume ? null : handleMousemoveVolumeChange}
	onclick={(e) => e.stopPropagation()}
	bind:this={volumeEl}
	role="presentation"
	class={twJoin(
		'transition-volume-width relative h-8 flex-shrink-0 overflow-hidden rounded-md',
		toggleVolume ? 'w-28 bg-white/30 backdrop-blur-2xl' : 'w-8 hover:bg-white/20',
		changingVolume && 'hover:cursor-none'
	)}
>
	<div
		class="transition-width pointer-events-none absolute h-full bg-white"
		style="width: {toggleVolume ? volume * 100 + '%' : 0}"
	></div>
	<button
		bind:this={volumeBtn}
		class={twJoin(
			'absolute left-1 top-1/2 -translate-y-1/2 select-none',
			changingVolume && 'hover:cursor-none'
		)}
		onclick={changingVolume ? null : handleClickVolumeBtn}
	>
		{#if volume < 0.25}
			<MaterialSymbolsVolumeMuteRounded
				height={24}
				width={24}
				class={twJoin(
					'pointer-events-none transition-colors',
					toggleVolume && volume > 0.1 ? 'text-zinc-950' : 'text-white'
				)}
			/>
		{:else if volume < 0.65}
			<MaterialSymbolsVolumeDownRounded
				height={24}
				width={24}
				class={twJoin(
					'pointer-events-none transition-colors',
					toggleVolume && volume > 0.1 ? 'text-zinc-950' : 'text-white'
				)}
			/>
		{:else}
			<MaterialSymbolsVolumeUpRounded
				height={24}
				width={24}
				class={twJoin(
					'pointer-events-none transition-colors',
					toggleVolume && volume > 0.1 ? 'text-zinc-950' : 'text-white'
				)}
			/>
		{/if}
	</button>
</div>

<style>
	.transition-volume-width {
		transition:
			width 350ms cubic-bezier(0.625, 0.05, 0, 1),
			background-color 350ms cubic-bezier(0.625, 0.05, 0, 1),
			backdrop-filter 300ms ease-out;
	}

	:global(.transition-width) {
		transition: width 100ms ease-out;
	}
</style>
