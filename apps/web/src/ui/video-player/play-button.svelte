<script lang="ts">
	import MaterialSymbolsPlayArrowRounded from '~icons/material-symbols/play-arrow-rounded';
	import MaterialSymbolsPauseRounded from '~icons/material-symbols/pause-rounded';

	let { videoEl = $bindable(), paused = $bindable() } = $props();

	function handleClickPlayBtn(e: MouseEvent) {
		if (!videoEl) return;
		e.stopPropagation();
		if (paused) {
			videoEl.play();
		} else {
			videoEl.pause();
		}
	}
</script>

<button
	onclick={handleClickPlayBtn}
	onmousedown={(e) => {
		e.preventDefault();
	}}
	class="flex h-8 w-8 flex-shrink-0 select-none items-center justify-center rounded-md transition-colors hover:bg-white/30"
>
	{#if paused}
		<MaterialSymbolsPlayArrowRounded height={24} width={24} />
	{:else}
		<MaterialSymbolsPauseRounded height={24} width={24} />
	{/if}
</button>
