<script lang="ts">
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

	let {
		isScrubbing = $bindable(),
		paused = $bindable(),
		videoEl,
		wasPaused = $bindable(),
		scrubber = $bindable(),
		progressBar = $bindable(),
		video
	} = $props();
</script>

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
