<script lang="ts">
	import { zod } from 'sveltekit-superforms/adapters';
	import { passwordSchema } from '$lib/schemas/auth';
	import { defaults, setMessage, superForm } from 'sveltekit-superforms';
	import { Control, Field, FieldErrors } from 'formsnap';
	import { twJoin } from 'tailwind-merge';
	import { tuyau } from '$lib/api';

	let errorCurrentPass = $state('');

	const form = superForm(defaults(zod(passwordSchema)), {
		SPA: true,
		invalidateAll: false,
		validators: zod(passwordSchema),
		resetForm: true,
		async onUpdate({ form }) {
			if (form.valid) {
				const { data, error } = await tuyau.v1.auth.password.reset_with_current.$post(form.data);
				if (error) {
					console.log(error.message);
					errorCurrentPass = error.message;
					setTimeout(() => {
						errorCurrentPass = '';
					}, 4000);
					return;
				}

				setMessage(form, data);
			}
		}
	});

	const { form: formData, enhance, errors, message } = form;
</script>

<form class="mt-4" use:enhance method="post">
	<div class="flex justify-between border-t border-t-zinc-50/20 pt-4">
		<div class="flex w-1/2 flex-col">
			<p class="text-lg leading-none">Password</p>
		</div>
		<div class="flex w-2/3 flex-col gap-y-2">
			<Field {form} name="currentPassword">
				<Control>
					<input
						id="currentPassword"
						type="password"
						bind:value={$formData.currentPassword}
						placeholder="Current password"
						class={twJoin(
							'w-full border border-zinc-50/20 bg-transparent placeholder:text-zinc-50/40 focus-visible:border-zinc-50/50 focus-visible:ring-0',
							($errors.currentPassword || errorCurrentPass !== '') && 'border-red-500'
						)}
					/>
					{#if errorCurrentPass !== ''}
						<p class="text-sm text-red-500">{errorCurrentPass}</p>
					{:else}
						<FieldErrors class="text-sm text-red-500" />
					{/if}
				</Control>
			</Field>
			<Field {form} name="newPassword">
				<Control>
					<input
						type="password"
						bind:value={$formData.newPassword}
						placeholder="New password"
						class={twJoin(
							'w-full border border-zinc-50/20 bg-transparent placeholder:text-zinc-50/40 focus-visible:border-zinc-50/50 focus-visible:ring-0',
							$errors.newPassword && 'border-red-500'
						)}
					/>
					<FieldErrors class="text-sm text-red-500" />
				</Control>
			</Field>
			<Field {form} name="confirm">
				<Control>
					<input
						type="password"
						bind:value={$formData.confirm}
						placeholder="Repeat new password"
						class={twJoin(
							'w-full border border-zinc-50/20 bg-transparent placeholder:text-zinc-50/40 focus-visible:border-zinc-50/50 focus-visible:ring-0',
							$errors.confirm && 'border-red-500'
						)}
					/>

					<FieldErrors class="text-sm text-red-500" />
				</Control>
			</Field>
		</div>
	</div>

	<div class="absolute bottom-5 left-5 flex w-[calc(100%-40px)] gap-x-4">
		<span
			class={twJoin(
				'flex w-full items-center justify-center border text-green-500',
				$message ? 'border-green-500' : 'border-transparent'
			)}
		>
			{$message}
		</span>
		<button class="bg-zinc-50 px-3 py-2 font-semibold text-zinc-950" type="submit">Save</button>
	</div>
</form>
