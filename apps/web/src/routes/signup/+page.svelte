<script lang="ts">
	import { tuyau } from '$lib/api';
	import { register } from '$lib/schemas/auth';
	import { Button } from 'bits-ui';
	import { Control, Field } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import SolarLetterBoldDuotone from '~icons/solar/letter-bold-duotone';
	import SolarLockPasswordBoldDuotone from '~icons/solar/lock-password-bold-duotone';
	import SolarShieldWarningBoldDuotone from '~icons/solar/shield-warning-bold-duotone';
	import Input from 'ui/shared/input.svelte';
	import { VERSION } from '$lib/constants/version.js';
	import Noise from 'ui/layout/noise.svelte';

	let globalError = $state('');
	let globalMessage = $state('');
	let email_input = $state<HTMLInputElement>();
	let password_input = $state<HTMLInputElement>();

	let { data } = $props();

	const form = superForm(data.form, {
		SPA: true,
		validators: zod(register),
		resetForm: true,
		validationMethod: 'onsubmit',
		async onUpdate({ form }) {
			if (form.valid) {
				const { data, error } = await tuyau.v1.auth.register.$post(form.data);
				if (error) {
					globalError = error.value.message;
					setTimeout(() => {
						globalError = '';
					}, 3000);
					return;
				}

				globalMessage = data;
				setTimeout(() => {
					globalMessage = '';
				}, 3000);
			}
		}
	});

	const { form: formData, enhance, errors } = form;
</script>

<svelte:head>
	<title>Sign up | Nosync</title>
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
		class="absolute left-[49.35%] top-[14rem] flex -translate-x-1/2 items-center gap-x-2 rounded-2xl text-green-300"
	>
		{globalMessage}
	</p>
{/if}

<div
	class="absolute left-1/2 top-1/2 flex min-w-[20rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
>
	<form method="POST" use:enhance class="w-full">
		<div class="flex w-full flex-col">
			<Field {form} name="email">
				<Control>
					{#snippet children({ props })}
						<Input
							{props}
							inputError={$errors.email && $errors.email.length > 0}
							label="Email"
							placeholder="john.doe@example.com"
							bind:input={email_input}
							bind:value={$formData.email}
							type="email"
							Icon={SolarLetterBoldDuotone}
						/>
					{/snippet}
				</Control>
			</Field>
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
							classes="mt-3"
						/>
					{/snippet}
				</Control>
			</Field>
			<Button.Root
				class="mt-6 bg-accent py-3 font-medium text-hometext transition-all hover:bg-accent hover:text-zinc-950 active:scale-[0.99]"
			>
				Create an account
			</Button.Root>
		</div>
	</form>

	<a
		href="/signin"
		class="mt-5 w-fit text-sm text-zinc-50/20 transition-colors hover:text-accent/75 hover:underline"
	>
		I already have an account
	</a>
</div>

<div class="absolute left-4 top-4 flex gap-x-2">
	<p class="w-fit bg-accent px-3 py-1 font-medium uppercase text-hometext">Alpha</p>
	<p class="w-fit bg-accent px-3 py-1 font-medium text-hometext">v{VERSION}</p>
</div>

<Noise animation={false} opacity={0.3} />
