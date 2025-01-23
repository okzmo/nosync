<script lang="ts">
	import type { TVideo } from '$lib/types/space';
	import { onMount } from 'svelte';
	import MaterialSymbolsPlayArrowRounded from '~icons/material-symbols/play-arrow-rounded';
	import MaterialSymbolsPauseRounded from '~icons/material-symbols/pause-rounded';
	import MaterialSymbolsVolumeDownRounded from '~icons/material-symbols/volume-down-rounded';
	import { twJoin } from 'tailwind-merge';

	let videoEl = $state<HTMLVideoElement | null>();
	let playBtn = $state<HTMLButtonElement | null>();
	let volumeBtn = $state<HTMLButtonElement | null>();
	let volumeEl = $state<HTMLDivElement | null>();
	let progressBar = $state<HTMLDivElement | null>();
	let scrubber = $state<HTMLDivElement | null>();
	let timeLabel = $state<HTMLElement | null>();
	let volume = $state(0);

	let paused = $state(true);
	let wasPaused = $state(true);
	let isScrubbing = $state(false);
	let toggleVolume = $state(false);
	let changingVolume = $state(false);

	const { video, width = $bindable() }: { video: TVideo; width: number } = $props();

	function handleScrubber(e: MouseEvent) {
		if (!isScrubbing) return;

		const scrubberRect = scrubber!.getBoundingClientRect();
		const sliderWidth = scrubberRect.width;
		const offsetX = e.clientX - scrubberRect.left;

		const pos = Math.max(0, Math.min(100, (offsetX / sliderWidth) * 100));
		progressBar!.style.width = pos + '%';
		videoEl!.currentTime = (pos * video.duration) / 100;
	}

	function handleMousedownScrubber(e: MouseEvent) {
		isScrubbing = true;
		if (!paused) {
			videoEl?.pause();
			wasPaused = false;
		}
		const scrubberRect = scrubber!.getBoundingClientRect();
		const sliderWidth = scrubberRect.width;
		const offsetX = e.clientX - scrubberRect.left;

		const pos = Math.max(0, Math.min(100, (offsetX / sliderWidth) * 100));
		progressBar!.style.width = pos + '%';
		videoEl!.currentTime = (pos * video.duration) / 100;
	}

	function handleMouseupScrubber(e: MouseEvent) {
		e.stopPropagation();
		isScrubbing = false;
		if (!wasPaused) {
			videoEl?.play();
			wasPaused = true;
		}
	}

	function handleClickPlayBtn(e: MouseEvent) {
		if (!videoEl) return;
		e.stopPropagation();
		if (paused) {
			videoEl.play();
		} else {
			videoEl.pause();
		}
	}

	function handleVideoPlaying() {
		paused = false;
	}

	function handleVideoPausing() {
		paused = true;
	}

	function handleKeypress(e: KeyboardEvent) {
		if (!videoEl) return;

		if (e.key === ' ') {
			e.preventDefault();
			e.stopPropagation();
			if (paused) {
				videoEl.play();
			} else {
				videoEl.pause();
			}
		}
	}

	function handleTimeUpdate() {
		if (!videoEl) return;

		const current = videoEl.currentTime;
		const duration = video.duration || 1;
		const percent = (current / duration) * 100;
		progressBar!.style.width = percent.toFixed(2) + '%';

		const mins = Math.floor(current / 60);
		const secs = Math.floor(current % 60);
		timeLabel!.textContent = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
	}

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

	onMount(() => {
		playBtn?.addEventListener('click', handleClickPlayBtn);
		videoEl?.addEventListener('play', handleVideoPlaying);
		videoEl?.addEventListener('pause', handleVideoPausing);
		videoEl?.addEventListener('timeupdate', handleTimeUpdate);
		window.addEventListener('keypress', handleKeypress);

		volume = videoEl?.volume;

		const mins = Math.floor(video.duration / 60);
		const secs = Math.floor(video.duration % 60);
		timeLabel!.textContent = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
	});
</script>

<figure
	onmousemove={handleScrubber}
	onmouseup={handleMouseupScrubber}
	onclick={() => {
		if (paused) {
			videoEl?.play();
		} else {
			videoEl?.pause();
		}
	}}
	role="presentation"
	style="aspect-ratio: {video.originalWidth} / {video.originalHeight}; padding-bottom: calc({video.originalWidth} / {video.originalHeight}); padding-left: {width}vw"
	class="fixed left-1/2 top-1/2 z-[998] max-h-[80vh] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-black before:pointer-events-none before:absolute before:left-0 before:top-0 before:z-[11] before:h-full before:w-full before:content-normal before:border before:border-zinc-50/10"
	class:hover:cursor-none={isScrubbing}
>
	<div class="group absolute left-0 z-10 h-full w-full">
		<div
			class="absolute left-0 top-0 h-full w-full bg-zinc-950/20 opacity-0 transition-opacity group-hover:opacity-100"
		></div>
		<video bind:this={videoEl} class="h-full w-full select-none object-cover" preload="metadata">
			<source src={video.originalUrl} type={video.mime} />
			<track kind="captions" />
		</video>
		<div
			role="presentation"
			class={twJoin(
				'absolute bottom-10 left-1/2 z-[10] flex -translate-x-1/2 items-center gap-x-4 opacity-0 transition-opacity group-hover:opacity-100',
				video.aspectRatio > 1 ? 'w-[50rem]' : 'w-[70%]'
			)}
		>
			<button bind:this={playBtn} class="select-none">
				{#if paused}
					<MaterialSymbolsPlayArrowRounded height={32} width={32} />
				{:else}
					<MaterialSymbolsPauseRounded height={32} width={32} />
				{/if}
			</button>
			<div
				onmousedown={handleMousedownVolumeChange}
				onmouseup={handleMouseupVolumeChange}
				onmousemove={handleMousemoveVolumeChange}
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
						'absolute bottom-0 left-0 select-none',
						changingVolume && 'hover:cursor-none'
					)}
					onclick={changingVolume ? null : handleClickVolumeBtn}
				>
					<MaterialSymbolsVolumeDownRounded
						height={32}
						width={32}
						class={twJoin(
							'pointer-events-none transition-colors',
							toggleVolume && volume > 0.1 ? 'text-zinc-950' : 'text-white'
						)}
					/>
				</button>
			</div>
			<div
				onmousedown={handleMousedownScrubber}
				role="presentation"
				class="transition-height relative h-[0.4rem] w-full overflow-hidden rounded-full bg-white/50 backdrop-blur-2xl hover:cursor-pointer"
				class:hover:!cursor-none={isScrubbing}
				class:h-[0.8rem]={isScrubbing}
				bind:this={scrubber}
			>
				<div
					class:transition-width={isScrubbing}
					bind:this={progressBar}
					class=" pointer-events-none absolute h-full w-0 bg-white"
				></div>
			</div>
			<span bind:this={timeLabel} class="block select-none">1:08</span>
		</div>

		<div class="progressive-blur-video pointer-events-none opacity-0 group-hover:opacity-100"></div>
	</div>
	<img alt="" class="absolute inset-0 h-full w-full select-none object-cover" src={video.blurUrl} />
</figure>

<style lang="postcss">
	.progressive-blur-video {
		transition: opacity 200ms cubic-bezier(0, 0.55, 0.45, 1);
		position: fixed;
		width: 100%;
		backdrop-filter: blur(64px);
		height: 200px;
		background-color: rgba(0, 0, 0, 0.25);
		bottom: 0;
		left: 0;
		mask-image: linear-gradient(
			0deg,
			#fafafa 5%,
			rgba(255, 255, 255, 0.93) 20%,
			rgba(255, 255, 255, 0) 100%
		);
	}

	.transition-height {
		transition: height 350ms cubic-bezier(0.625, 0.05, 0, 1);
	}

	.transition-volume-width {
		transition:
			width 350ms cubic-bezier(0.625, 0.05, 0, 1),
			background-color 350ms cubic-bezier(0.625, 0.05, 0, 1),
			backdrop-filter 300ms ease-out;
	}

	.transition-width {
		transition: width 100ms ease-out;
	}
</style>
