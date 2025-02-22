<script lang="ts">
	import { goto } from '$app/navigation';
	import { tuyau } from '$lib/api';
	import { recoveryPassword } from '$lib/schemas/auth';
	import { Button } from 'bits-ui';
	import { Control, Field } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import SolarLockPasswordBoldDuotone from '~icons/solar/lock-password-bold-duotone';
	import SolarShieldWarningBoldDuotone from '~icons/solar/shield-warning-bold-duotone';
	import Input from 'ui/shared/input.svelte';
	import { page } from '$app/stores';

	let globalError = $state('');
	let globalMessage = $state('');
	let password_input = $state<HTMLInputElement>();

	let { data } = $props();

	const form = superForm(data.form, {
		SPA: true,
		validators: zod(recoveryPassword),
		resetForm: true,
		validationMethod: 'onsubmit',
		async onUpdate({ form }) {
			if (form.valid) {
				const { data, error } = await tuyau.v1.auth.recovery
					.password({ token: $page.params['token'] })
					.$post({ newPassword: form.data.password });
				if (error) {
					globalError = error.value.errors[0].message;
					setTimeout(() => password_input?.focus(), 5);
					return;
				}

				globalMessage = data;
				await new Promise((resolve) => setTimeout(resolve, 2000));
				goto(`/signin`);
			}
		}
	});

	const { form: formData, enhance, errors } = form;
</script>

<svelte:head>
	<title>Password recovery | Nosync</title>
</svelte:head>

{#if globalError}
	<p
		class="absolute left-[49.35%] top-[14rem] flex -translate-x-1/2 items-center gap-x-2 rounded-2xl text-red-500"
	>
		<SolarShieldWarningBoldDuotone />
		{globalError}
	</p>
{/if}

{#if globalMessage}
	<p
		class="absolute left-[49.35%] top-[14rem] flex -translate-x-1/2 items-center gap-x-2 rounded-2xl text-center text-green-500"
	>
		{globalMessage}
	</p>
{/if}

<div
	class="absolute left-1/2 top-1/2 flex min-w-[20rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
>
	{#if !data.isInvalid}
		<form method="POST" use:enhance class="w-full">
			<div class="flex w-full flex-col">
				<Field {form} name="password">
					<Control>
						{#snippet children({ props })}
							<Input
								{props}
								inputError={$errors.password && $errors.password.length > 0}
								label="Password"
								placeholder="Password"
								bind:input={password_input}
								bind:value={$formData.password}
								type="password"
								Icon={SolarLockPasswordBoldDuotone}
							/>
						{/snippet}
					</Control>
				</Field>
				<Button.Root
					class="mt-6 rounded-2xl bg-zinc-50 py-3 font-medium text-zinc-950 transition-all hover:bg-zinc-50/90 active:scale-[0.99]"
				>
					Reset password
				</Button.Root>
			</div>
		</form>
	{:else}
		<h2 class="text-center font-serif text-5xl italic text-zinc-700">This link has expired</h2>
		<a class="mt-5 underline" href="/recovery/password">Please try again</a>
	{/if}
</div>

<div class="absolute left-5 top-4 flex flex-col font-code">
	<h1 class="uppercase">Breash <span class="text-[#F22E48]">[alpha release]</span></h1>
	<p class="uppercase">
		Version <span class="bg-version bg-clip-text text-transparent">[ocean wave]</span>
	</p>
	<p class="uppercase">State: [password recovery]</p>
</div>
