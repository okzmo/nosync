<script lang="ts">
	import type { TVideo } from '$lib/types/space';
	import { onMount } from 'svelte';
	import { twJoin } from 'tailwind-merge';
	import Scrubber from './scrubber.svelte';
	import Volume from './volume.svelte';
	import PlayButton from './play-button.svelte';

	let videoEl = $state<HTMLVideoElement | null>();
	let progressBar = $state<HTMLDivElement | null>();
	let scrubber = $state<HTMLDivElement | null>();
	let timeLabel = $state<HTMLElement | null>();
	let volume = $state(0);
	let toggleVolume = $state(false);
	let togglePlayerUI = $state(false);
	let hideUITimeout: ReturnType<typeof setTimeout> | null = $state(null);

	let paused = $state(true);
	let wasPaused = $state(true);
	let isScrubbing = $state(false);

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

	function handleMouseupScrubber(e: MouseEvent) {
		e.stopPropagation();
		isScrubbing = false;
		if (!wasPaused) {
			videoEl?.play();
			wasPaused = true;
		}
	}

	function handleVideoPlaying() {
		paused = false;
	}

	function handleVideoPausing() {
		paused = true;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!videoEl) return;

		if (e.key === ' ') {
			e.preventDefault();
			e.stopPropagation();
			if (paused) {
				videoEl.play();
			} else {
				videoEl.pause();
			}
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
			e.preventDefault();
			e.stopPropagation();

			togglePlayerUI = true;

			const step = 10 * (e.key === 'ArrowRight' ? 1 : -1);
			videoEl.currentTime += step;

			if (hideUITimeout) {
				clearTimeout(hideUITimeout);
			}

			hideUITimeout = setTimeout(() => {
				togglePlayerUI = false;
			}, 1500);
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
			e.preventDefault();
			e.stopPropagation();

			toggleVolume = true;
			togglePlayerUI = true;

			const step = 0.05 * (e.key === 'ArrowUp' ? 1 : -1);
			const newVolume = Math.max(0, Math.min(1, volume + step));
			volume = newVolume;
			videoEl!.volume = newVolume;

			if (hideUITimeout) {
				clearTimeout(hideUITimeout);
			}

			hideUITimeout = setTimeout(() => {
				toggleVolume = false;
				togglePlayerUI = false;
			}, 1500);
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
		videoEl?.addEventListener('play', handleVideoPlaying);
		videoEl?.addEventListener('pause', handleVideoPausing);
		videoEl?.addEventListener('timeupdate', handleTimeUpdate);
		window.addEventListener('keydown', handleKeydown);

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
			class:opacity-100={togglePlayerUI}
		></div>
		<video bind:this={videoEl} class="h-full w-full select-none object-cover" preload="metadata">
			<source src={video.originalUrl} type={video.mime} />
			<track kind="captions" />
		</video>
		<div
			role="presentation"
			class={twJoin(
				'absolute  left-1/2 z-[10] flex -translate-x-1/2 items-center gap-x-3 opacity-0 transition-opacity group-hover:opacity-100',
				video.aspectRatio > 1 ? 'bottom-10 w-[50rem]' : 'bottom-8 w-[80%]'
			)}
			class:opacity-100={togglePlayerUI}
		>
			<PlayButton bind:paused bind:videoEl />
			<Volume bind:volume bind:toggleVolume bind:videoEl />
			<Scrubber
				{video}
				{videoEl}
				bind:scrubber
				bind:isScrubbing
				bind:wasPaused
				bind:paused
				bind:progressBar
			/>
			<span bind:this={timeLabel} class="ml-2 block select-none">{timeLabel}</span>
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
</style>
