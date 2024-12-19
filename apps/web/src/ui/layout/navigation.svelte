<script lang="ts">
	import { fade } from 'svelte/transition';
	import { menu } from '$lib/stores/menu.svelte';
	import { space } from '$lib/stores/space.svelte';
	import SolarSettingsBoldDuotone from '~icons/solar/settings-bold-duotone';
	import SolarBellBoldDuotone from '~icons/solar/bell-bold-duotone';
	import SolarSun2BoldDuotone from '~icons/solar/sun-2-bold-duotone';
</script>

<header class="fixed top-0 z-[999] w-full">
	{#if menu.open}
		<ul
			class="absolute left-8 top-5 z-[1] flex gap-x-3 font-serif text-lg italic"
			transition:fade={{ duration: 75 }}
		>
			<li class="text-zinc-50/50">{space.currentSpace?.name}</li>
			<span class="text-zinc-50/50">/</span>
			<li>{space.currentBranch?.name}</li>
		</ul>

		<nav class="relative z-[1] flex justify-center pt-5" transition:fade={{ duration: 75 }}>
			<ul class="flex gap-x-6 font-serif text-lg italic text-zinc-50/50">
				<li><a href="/" class="text-zinc-50">home</a></li>
				<li><a href="/mail" class="transition-colors hover:text-zinc-50/65">mail</a></li>
				<li><a href="/calendar" class="transition-colors hover:text-zinc-50/65">calendar</a></li>
				<li><a href="/profile" class="transition-colors hover:text-zinc-50/65">profile</a></li>
			</ul>
		</nav>

		<ul
			class="absolute right-8 top-5 z-[1] flex gap-x-3 font-serif text-lg italic"
			transition:fade={{ duration: 75 }}
		>
			<li>
				<a href="/settings" class="text-zinc-50/50 transition-colors hover:text-zinc-50">
					<SolarSettingsBoldDuotone height={22} width={22} />
				</a>
			</li>
			<li>
				<button class="text-zinc-50/50 transition-colors hover:text-zinc-50">
					<SolarBellBoldDuotone height={22} width={22} />
				</button>
			</li>
			<li>
				<button class="text-zinc-50/50 transition-colors hover:text-zinc-50">
					<SolarSun2BoldDuotone height={22} width={22} />
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
		transition: opacity 75ms cubic-bezier(0, 0.55, 0.45, 1);
		will-change: transform;
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
