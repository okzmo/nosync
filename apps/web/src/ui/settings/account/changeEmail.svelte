<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { Control, Field, FieldErrors } from 'formsnap';
	import { emailSchema } from '$lib/schemas/auth';
	import { tuyau } from '$lib/api';
	import { twJoin } from 'tailwind-merge';
	import MaterialSymbolsFitbitCheckSmallRounded from '~icons/material-symbols/fitbit-check-small-rounded';

	let { successMessage = $bindable() } = $props();

	const form = superForm(defaults(zod(emailSchema)), {
		SPA: true,
		invalidateAll: false,
		validators: zod(emailSchema),
		resetForm: true,
		validationMethod: 'onsubmit',
		async onUpdate({ form }) {
			if (form.valid) {
				const { data, error } = await tuyau.v1.auth.email.change.$post(form.data);
				if (error) {
					console.log(error.message);
					return;
				}

				successMessage = data;
				setTimeout(() => {
					successMessage = '';
				}, 3000);
			}
		}
	});

	const { form: formData, enhance, errors } = form;
</script>

<form class="mt-4" use:enhance>
	<div class="flex justify-between border-t border-t-zinc-50/20 pt-4">
		<div class="flex w-1/2 flex-col">
			<p class="text-lg leading-none">Email</p>
		</div>
		<Field {form} name="email">
			<Control>
				<div class="flex w-2/3 flex-col">
					<div class="relative">
						<input
							id="email"
							bind:value={$formData.email}
							type="text"
							placeholder={auth.user?.email}
							class={twJoin(
								'w-full border  bg-transparent placeholder:text-zinc-50/40 focus-visible:border-zinc-50/50 focus-visible:ring-0',
								$errors.email ? 'border-red-500' : 'border-zinc-50/20'
							)}
						/>
						{#if $formData.email.length > 0}
							<button
								type="submit"
								class="group absolute right-[0.3rem] top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-zinc-800"
							>
								<MaterialSymbolsFitbitCheckSmallRounded
									height={22}
									width={22}
									class="transition-colors duration-100 group-hover:text-green-400"
								/>
							</button>
						{/if}
					</div>

					<FieldErrors class="text-sm text-red-500" />
				</div>
			</Control>
		</Field>
	</div>
</form>
