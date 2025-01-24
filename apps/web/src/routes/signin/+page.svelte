<script lang="ts">
	import { goto } from '$app/navigation';
	import { tuyau } from '$lib/api';
	import { login } from '$lib/schemas/auth';
	import { Button } from 'bits-ui';
	import { Control, Field } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import SolarLetterBoldDuotone from '~icons/solar/letter-bold-duotone';
	import SolarLockPasswordBoldDuotone from '~icons/solar/lock-password-bold-duotone';
	import SolarShieldWarningBoldDuotone from '~icons/solar/shield-warning-bold-duotone';
	import Input from 'ui/shared/input.svelte';

	let globalError = $state('');
	let email_input = $state<HTMLInputElement>();
	let password_input = $state<HTMLInputElement>();

	let { data } = $props();

	const form = superForm(data.form, {
		SPA: true,
		validators: zod(login),
		resetForm: true,
		validationMethod: 'onsubmit',
		async onUpdate({ form }) {
			if (form.valid) {
				const { error } = await tuyau.v1.auth.login.$post(form.data);
				console.log(error);
				if (error) {
					globalError = error.value.errors[0].message;
					setTimeout(() => email_input?.focus(), 5);
					return;
				}

				return goto(`/setup`);
			}
		}
	});

	const { form: formData, enhance, errors } = form;
</script>

{#if globalError}
	<p
		class="absolute left-[49.35%] top-[14rem] flex -translate-x-1/2 items-center gap-x-2 rounded-2xl text-red-500"
	>
		<SolarShieldWarningBoldDuotone />
		{globalError}
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
				class="mt-6 rounded-2xl bg-zinc-50 py-3 font-medium text-zinc-950 transition-all hover:bg-zinc-50/90 active:scale-[0.99]"
			>
				Sign in
			</Button.Root>
		</div>
	</form>

	<a
		href="/signup"
		class="mt-5 w-fit text-sm text-zinc-50/20 transition-colors hover:text-zinc-50/40 hover:underline"
	>
		I don't have an account
	</a>
</div>

<div class="absolute left-5 top-4 flex flex-col font-code">
	<h1 class="uppercase">1sync <span class="text-[#F22E48]">[alpha release]</span></h1>
	<p class="uppercase">
		Version <span class="bg-version bg-clip-text text-transparent">[new era]</span>
	</p>
	<p class="uppercase">State: [sign in]</p>
</div>
