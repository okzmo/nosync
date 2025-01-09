<script lang="ts">
	import SolarHome2BoldDuotone from '~icons/solar/home-2-bold-duotone';
	import SolarMailboxBoldDuotone from '~icons/solar/mailbox-bold-duotone';
	import SolarCalendarBoldDuotone from '~icons/solar/calendar-bold-duotone';
	import SolarUserBoldDuotone from '~icons/solar/user-bold-duotone';
	import SolarSettingsBoldDuotone from '~icons/solar/settings-bold-duotone';
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { space } from '$lib/stores/space.svelte';

	const LINKS = [
		{
			label: 'home',
			href: `/${space.currentSpace?.name.toLowerCase()}/${space.currentBranch?.name.toLowerCase()}`,
			icon: SolarHome2BoldDuotone,
			class: 'home'
		},
		{ label: 'mail', href: `#`, icon: SolarMailboxBoldDuotone, class: 'mail' },
		{ label: 'calendar', href: `#`, icon: SolarCalendarBoldDuotone, class: 'calendar' },
		{ label: 'profile', href: `#`, icon: SolarUserBoldDuotone, class: 'user' }
	];

	let box = $state<HTMLDivElement | null>();
	let nav = $state<HTMLElement | null>();
	let innerNav = $state<HTMLElement | null>();
	let activeLink = $derived.by(() => {
		const urlFirstEl = $page.url.pathname.split('/')[1];

		for (const link of LINKS) {
			if (link.href.includes(urlFirstEl)) {
				return link;
			}
		}
	});

	function handleMove(e: MouseEvent) {
		if (!box) return;

		const target = e.target as HTMLElement;
		const offsetLeft = nav?.getBoundingClientRect().left;

		if (target.classList.contains('nav-el') && offsetLeft) {
			const rect = target.getBoundingClientRect();
			const left = rect.left - offsetLeft;

			box.style.transform = `translateX(${left}px) translateY(-50%)`;
			box.style.width = rect.width + 'px';
		}
	}

	function handleLeave() {
		if (!box) return;
		const mainNavChildren = innerNav?.children;
		const offsetLeft = innerNav?.getBoundingClientRect().left;
		const urlFirstEl = $page.url.pathname.split('/')[1];

		if (!mainNavChildren || !offsetLeft) return;
		for (const el of mainNavChildren) {
			const anchor = el.children[0] as HTMLAnchorElement;

			if (anchor.tagName === 'A' && anchor.href.includes(urlFirstEl)) {
				const rect = anchor.getBoundingClientRect();
				const left = rect.left - offsetLeft;

				box.style.transform = `translateX(${left}px) translateY(-50%)`;
				break;
			}
		}
	}

	onMount(() => {
		innerNav?.addEventListener('mousemove', handleMove);
		innerNav?.addEventListener('mouseleave', handleLeave);

		if (box && nav && activeLink) {
			const activeLinkEl = document.getElementsByClassName(activeLink?.class);
			const offsetLeft = nav.getBoundingClientRect().left;
			const rect = activeLinkEl[0].getBoundingClientRect();
			box.style.transform = `translateX(${rect.left - offsetLeft}px) translateY(-50%)`;
			box.style.width = rect.width + 'px';
		}
	});

	onDestroy(() => {
		nav?.removeEventListener('mousemove', handleMove);
		nav?.removeEventListener('mouseleave', handleLeave);
	});
</script>

<nav class="fixed bottom-8 left-1/2 flex -translate-x-1/2 gap-x-3" bind:this={nav}>
	<div
		bind:this={box}
		class="pointer-events-none absolute top-1/2 z-10 h-10 -translate-y-1/2 translate-x-[0.375rem] rounded-xl bg-zinc-50/15 transition-all"
	></div>
	<ul
		bind:this={innerNav}
		class="flex gap-x-1 rounded-2xl bg-zinc-800/45 p-[0.375rem] backdrop-blur-3xl"
	>
		{#each LINKS as link}
			<li>
				<a
					href={link.href}
					class="nav-el flex h-full w-full items-center justify-center gap-x-2 px-3 py-1 text-zinc-500 transition-colors hover:text-zinc-50 {link.class}"
					class:!text-zinc-50={activeLink?.href === link.href}
				>
					<span class="font-serif text-lg italic !leading-none">{link.label}</span>
				</a>
			</li>
		{/each}
	</ul>

	<div
		class="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-xl bg-zinc-800/45 p-[0.375rem] backdrop-blur-3xl"
	>
		<a
			class="group flex h-full w-full items-center justify-center rounded-lg bg-transparent transition-colors hover:bg-zinc-50/15"
			href="/settings"
		>
			<SolarSettingsBoldDuotone
				height={24}
				width={24}
				class="text-zinc-600 transition-colors group-hover:text-zinc-50"
			/>
		</a>
	</div>
</nav>
