<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { Dialog } from 'bits-ui';
	import { twJoin } from 'tailwind-merge';
	import Account from './account/account.svelte';
	import ChangePassword from './changePassword.svelte';
	import MaterialSymbolsCloseRounded from '~icons/material-symbols/close-rounded';

	let tab = $state('account');

	const LINKS = [
		{ title: 'Account', tab: 'account' },
		{ title: 'Password', tab: 'password' }
	];
</script>

<Dialog.Root
	open={page.state.showSettings}
	onOpenChange={(state) => {
		if (!state) {
			history.back();
		}
	}}
>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
		<Dialog.Content
			onInteractOutside={() => {
				replaceState('', {});
				history.back();
			}}
			class="shadow-popover fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] border border-zinc-50/10 bg-zinc-900 p-5 outline-none sm:h-[450px] sm:max-w-[550px] md:w-full"
		>
			<Dialog.Title class="text-2xl font-semibold">Settings</Dialog.Title>
			<ul class="mt-4 flex gap-x-1">
				{#each LINKS as link}
					<li class="flex">
						<button
							class={twJoin(
								'px-3 py-1 ',
								tab === link.tab ? 'bg-zinc-50/10 text-zinc-50' : 'text-zinc-50/40'
							)}
							onclick={() => (tab = link.tab)}>{link.title}</button
						>
					</li>
				{/each}
			</ul>
			{#if tab === 'account'}
				<Account />
			{:else if tab === 'password'}
				<ChangePassword />
			{/if}
			<Dialog.Close class="fixed right-5 top-5 p-1 transition-colors hover:bg-zinc-50/10">
				<MaterialSymbolsCloseRounded height={22} width={22} />
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
