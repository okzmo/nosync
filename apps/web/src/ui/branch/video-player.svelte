<script lang="ts">
	import type { TVideo } from '$lib/types/space';
	import { onMount } from 'svelte';
	import MaterialSymbolsPlayArrowRounded from '~icons/material-symbols/play-arrow-rounded';
	import MaterialSymbolsPauseRounded from '~icons/material-symbols/pause-rounded';

	let videoEl = $state<HTMLVideoElement | null>();
	let playBtn = $state<HTMLButtonElement | null>();
	let progressBar = $state<HTMLDivElement | null>();
	let scrubber = $state<HTMLDivElement | null>();
	let timeLabel = $state<HTMLElement | null>();

	let paused = $state(true);
	let wasPaused = $state(true);
	let isScrubbing = $state(false);

	const { video, width = $bindable() }: { video: TVideo; width: number } = $props();

	function handleScrubber(e: MouseEvent) {
		if (!isScrubbing) return;
		const vidRect = videoEl!.getBoundingClientRect();
		const rectScrubber = scrubber?.getBoundingClientRect();
		if (!rectScrubber || !vidRect) return;

		const scrubberWidth = rectScrubber.width;
		const scrubberStart = (vidRect.width - scrubberWidth) / 2;

		const pos = ((e.clientX - vidRect.left - scrubberStart) / scrubberWidth) * 100;
		if (pos > -0.1 && pos <= 100.14) {
			progressBar!.style.width = pos.toFixed(2) + '%';
			videoEl!.currentTime = (pos * video.duration) / 100;
		}
	}

	function handleMousedownScrubber(e: MouseEvent) {
		isScrubbing = true;
		if (!paused) {
			videoEl?.pause();
			wasPaused = false;
		}
		const vidRect = videoEl!.getBoundingClientRect();
		const rectScrubber = scrubber?.getBoundingClientRect();
		if (!rectScrubber || !vidRect) return;

		const scrubberWidth = rectScrubber.width;
		const scrubberStart = (vidRect.width - scrubberWidth) / 2;

		const pos = ((e.clientX - vidRect.left - scrubberStart) / scrubberWidth) * 100;
		progressBar!.style.width = pos + '%';
		videoEl!.currentTime = (pos * video.duration) / 100;
	}

	function handleMouseupScrubber() {
		isScrubbing = false;
		if (!wasPaused) {
			videoEl?.play();
			wasPaused = true;
		}
	}

	function handleClickPlayBtn() {
		if (!videoEl) return;
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

	onMount(() => {
		playBtn?.addEventListener('click', handleClickPlayBtn);
		videoEl?.addEventListener('play', handleVideoPlaying);
		videoEl?.addEventListener('pause', handleVideoPausing);
		videoEl?.addEventListener('timeupdate', handleTimeUpdate);
		window.addEventListener('keypress', handleKeypress);

		const mins = Math.floor(video.duration / 60);
		const secs = Math.floor(video.duration % 60);
		timeLabel!.textContent = `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
	});
</script>

<figure
	onmousemove={handleScrubber}
	onmouseup={handleMouseupScrubber}
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
			class="absolute bottom-10 left-1/2 z-[10] flex w-[50rem] -translate-x-1/2 items-center gap-x-4 opacity-0 transition-opacity group-hover:opacity-100"
		>
			<button bind:this={playBtn}>
				{#if paused}
					<MaterialSymbolsPlayArrowRounded height={32} width={32} />
				{:else}
					<MaterialSymbolsPauseRounded height={32} width={32} />
				{/if}
			</button>
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

	.transition-width {
		transition: width 100ms ease-out;
	}
</style>
