<script lang="ts">
	import { page } from '$app/stores';
	import { twJoin } from 'tailwind-merge';

	const SETTINGS_LINKS = [
		{ href: '/settings/profile', text: 'Profile' },
		{ href: '/settings/account', text: 'Account' },
		{ href: '/settings/password', text: 'Password' }
	];

	let { children } = $props();
</script>

<div class="flex p-7">
	<div>
		<h1 class="text-xl font-semibold">Settings</h1>
		<ul class="mt-4 flex flex-col gap-y-1 text-zinc-500">
			{#each SETTINGS_LINKS as setting}
				<li class="flex">
					<a
						href={setting.href}
						class={twJoin(
							'rounded-md px-3 py-1 transition-colors ',
							$page.url.pathname === setting.href ? 'text-zinc-50' : 'hover:text-zinc-50/75'
						)}
					>
						{setting.text}
					</a>
				</li>
			{/each}
		</ul>
	</div>

	{@render children()}
</div>
