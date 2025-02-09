<script lang="ts">
	import { menu } from '$lib/stores/menu.svelte';
	import { fade } from 'svelte/transition';
	import SolarSettingsBoldDuotone from '~icons/solar/settings-bold-duotone';
	import SolarSun2BoldDuotone from '~icons/solar/sun-2-bold-duotone';
	import Breadcrumbs from './navigation/breadcrumbs.svelte';
	import { pushState } from '$app/navigation';

	function showSettings() {
		menu.closeMenu();
		pushState('/settings', { showSettings: true });
	}
</script>

<header class="fixed top-0 z-[999] flex w-full items-center justify-between px-8 pt-5">
	{#if menu.open}
		<Breadcrumbs />

		<nav
			class="fixed left-1/2 z-[1] flex -translate-x-1/2 justify-center"
			transition:fade={{ duration: 45 }}
		>
			<ul class="flex gap-x-6 font-serif text-lg italic text-zinc-50/50">
				<li><a href="/" class="text-zinc-50">home</a></li>
				<li><span class="transition-colors hover:cursor-not-allowed">mail</span></li>
				<li><span class="transition-colors hover:cursor-not-allowed">calendar</span></li>
			</ul>
		</nav>

		<ul
			class="z-[1] flex items-center gap-x-4 font-serif text-lg italic"
			transition:fade={{ duration: 45 }}
		>
			<li class="flex items-center justify-center">
				<button class="text-zinc-50/50 transition-colors hover:text-zinc-50" onclick={showSettings}>
					<SolarSettingsBoldDuotone height={18} width={18} />
				</button>
			</li>
			<!-- <li class="flex items-center justify-center"> -->
			<!-- 	<button class="text-zinc-50/50 transition-colors hover:text-zinc-50"> -->
			<!-- 		<SolarBellBoldDuotone height={18} width={18} /> -->
			<!-- 	</button> -->
			<!-- </li> -->
			<li class="flex items-center justify-center">
				<button class="text-zinc-50/50 transition-colors hover:text-zinc-50">
					<SolarSun2BoldDuotone height={18} width={18} />
				</button>
			</li>
		</ul>
	{/if}

	<div class="progressive-blur up pointer-events-none opacity-0" class:active={menu.open}></div>
</header>

<style lang="postcss">
	.active {
		opacity: 100%;
	}

	.progressive-blur.up {
		transition: opacity 45ms cubic-bezier(0, 0.55, 0.45, 1);
		backface-visibility: hidden;
		position: absolute;
		top: 0;
		left: 0;
		mask-image: linear-gradient(
			180deg,
			#fafafa 5%,
			rgba(250, 250, 250, 0.93) 30%,
			rgba(250, 250, 250, 0.78) 50%,
			rgba(250, 250, 250, 0.52) 75%,
			rgba(250, 250, 250, 0) 100%
		);
	}
</style>
