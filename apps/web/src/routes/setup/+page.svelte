<script lang="ts">
	import { goto } from '$app/navigation';
	import { tuyau } from '$lib/api/index.js';
	import { spaceCreation } from '$lib/schemas/space';
	import { Control, Field, FieldErrors } from 'formsnap';
	import { fly } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import SolarShieldWarningBoldDuotone from '~icons/solar/shield-warning-bold-duotone';

	let { data } = $props();

	const form = superForm(data.form, {
		SPA: true,
		validators: zod(spaceCreation),
		validationMethod: 'oninput',
		async onUpdate({ form }) {
			if (form.valid) {
				const { data, error } = await tuyau.v1.space.create.$post(form.data);
				if (error) {
					console.error(error);
				}

				const first_space = data.name.toLowerCase();
				const first_branch = data.branches[0].name.toLowerCase();

				return goto(`/${first_space}/${first_branch}`);
			}
		}
	});

	const { form: formData, enhance, errors } = form;
</script>

<svelte:head>
	<title>Set up | Nosync</title>
</svelte:head>

<div class="absolute left-5 top-4 font-code uppercase">STATUS [CREATING SPACE]</div>

<form
	class="absolute left-1/2 top-1/2 max-w-[35%] -translate-x-1/2 -translate-y-1/2"
	use:enhance
	method="POST"
>
	<Field {form} name="name">
		<Control>
			{#snippet children({ props })}
				<input
					class="w-full border-b border-l-0 border-r-0 border-t-0 border-zinc-50/30 bg-zinc-950 px-4 py-3 text-center font-serif text-5xl italic transition-colors placeholder:text-center placeholder:text-zinc-50/35 focus:border-zinc-50/50 focus:outline-none focus:ring-0"
					placeholder="Life"
					{...props}
					bind:value={$formData.name}
				/>
				{#if $errors.name}
					<div
						transition:fly={{ y: 5, duration: 75 }}
						class="absolute mt-8 flex w-full items-center justify-center gap-x-2 rounded-2xl text-sm text-red-500"
					>
						<SolarShieldWarningBoldDuotone />
						<FieldErrors />
					</div>
				{/if}
			{/snippet}
		</Control>
	</Field>
</form>
