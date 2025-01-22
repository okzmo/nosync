<script>
	import { cell } from '$lib/stores/cell.svelte';
</script>

{#if cell.maximized}
	{#if cell.maximized.type === 'photo'}
		<figure
			style="height: {cell.maximized.originalHeight}px; width: {cell.maximized
				.originalWidth}px; aspect-ratio: {cell.maximized.originalHeight} / {cell.maximized
				.originalWidth};"
			class="fixed left-1/2 top-1/2 z-[998] max-h-[80%] max-w-[80%] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-black before:absolute before:left-0 before:top-0 before:h-full before:w-full before:content-normal before:border before:border-zinc-50/10"
		>
			<img src={cell.maximized.originalUrl} alt="" class="h-full w-full select-none object-cover" />
			<img
				alt=""
				class="absolute left-0 top-0 z-[-1] h-full w-full select-none object-cover"
				src={cell.maximized.blurUrl}
			/>
		</figure>
	{:else if cell.maximized.type === 'video'}
		<figure
			style="height: {cell.maximized.originalHeight}px; width: {cell.maximized
				.originalWidth}px; aspect-ratio: {cell.maximized.originalHeight} / {cell.maximized
				.originalWidth};"
			class="fixed left-1/2 top-1/2 z-[998] max-h-[80%] max-w-[80%] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-black before:pointer-events-none before:absolute before:left-0 before:top-0 before:h-full before:w-full before:content-normal before:border before:border-zinc-50/10"
		>
			<video controls class="h-full w-full select-none object-cover">
				<source src={cell.maximized.originalUrl} type={cell.maximized.mime} />
				<track kind="captions" />
			</video>
			<img
				alt=""
				class="absolute left-0 top-0 z-[-1] h-full w-full select-none object-cover"
				src={cell.maximized.blurUrl}
			/>
		</figure>
	{/if}
{/if}
