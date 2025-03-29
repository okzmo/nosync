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
	import { VERSION } from '$lib/constants/version.js';

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

<svelte:head>
	<title>Sign in | Nosync</title>
</svelte:head>

{#if globalError}
	<p
		class="absolute left-[49.35%] top-[14rem] flex -translate-x-1/2 items-center gap-x-2 rounded-2xl text-red-500"
	>
		<SolarShieldWarningBoldDuotone />
		{globalError}
	</p>
{/if}

<h1 class="sr-only">Sign up</h1>

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
				class="mt-6 border border-accent bg-accent/40 py-3 font-medium text-accent transition-all hover:bg-accent hover:text-zinc-950 active:scale-[0.99]"
			>
				Sign in
			</Button.Root>
		</div>
	</form>

	<a
		href="/signup"
		class="mt-5 w-fit text-sm text-zinc-50/20 transition-colors hover:text-accent/75 hover:underline"
	>
		I don't have an account
	</a>
</div>

<div class="absolute left-4 top-4 flex gap-x-2">
	<p class="w-fit border border-accent bg-accent/20 px-3 py-1 uppercase text-accent">Alpha</p>
	<p class="w-fit border border-accent bg-accent/20 px-3 py-1 text-accent">v{VERSION}</p>
</div>

<svg
	class="not-sr-only fixed bottom-4 left-4 text-[10rem]"
	width={525}
	viewBox="0 0 577 111"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M20.4651 105.602L20.4701 105.604C26.9961 108.273 34.6217 109.593 43.3238 109.593C56.4065 109.593 66.7077 106.763 74.098 100.972C81.6225 95.1521 85.3587 86.9164 85.3587 76.4031C85.3587 71.0757 84.4712 66.4746 82.6525 62.635C80.8565 58.8434 78.4522 55.6809 75.4353 53.1652C72.5618 50.6891 69.3907 48.6582 65.9245 47.0737C62.5105 45.513 59.047 44.1469 55.534 42.9758C52.1654 41.8208 49.0383 40.7143 46.1523 39.6563C43.4216 38.5247 41.2514 37.2694 39.6139 35.9049C38.1083 34.6502 37.3638 33.0497 37.3638 31.0181C37.3638 29.0565 38.1891 27.5842 39.9351 26.5034C41.7469 25.3818 44.3417 24.7681 47.8188 24.7681C51.4474 24.7681 54.777 25.5114 57.8225 26.9879C60.8917 28.4761 63.9445 30.723 66.9766 33.7552L67.6806 34.4592L68.3877 33.7583L84.9177 17.3733L85.5994 16.6977L84.9522 15.9889C80.7786 11.4178 75.476 7.85698 69.0701 5.29464C62.6574 2.72956 55.6666 1.45312 48.1088 1.45312C40.5536 1.45312 33.8842 2.72875 28.1247 5.31061C22.3664 7.89193 17.8181 11.5817 14.5147 16.3866L14.5107 16.3925L14.5067 16.3984C11.2855 21.2303 9.69875 27.0384 9.69875 33.7731C9.69875 39.0045 10.5865 43.4697 12.4143 47.1253C14.2122 50.721 16.5684 53.7338 19.4862 56.1485L19.4926 56.1538L19.4991 56.159C22.4578 58.526 25.6626 60.5473 29.1118 62.2226L29.1271 62.23L29.1426 62.2369C32.6477 63.7948 36.1066 65.159 39.5194 66.3291L39.5354 66.3345L39.5515 66.3395C42.9987 67.3928 46.1005 68.5388 48.8597 69.7756L48.8784 69.784L48.8974 69.7916C51.7144 70.9184 53.9168 72.2601 55.5421 73.7951L55.5531 73.8055L55.5644 73.8155C57.0818 75.1644 57.8388 76.8697 57.8388 79.0131C57.8388 81.2421 56.8395 83.0187 54.6793 84.4029C52.5863 85.7093 49.4691 86.4231 45.2088 86.4231C40.217 86.4231 35.7782 85.4826 31.8722 83.6243C27.9333 81.6535 24.2097 78.8298 20.7042 75.1349L19.9945 74.3868L19.2685 75.1191L2.88354 91.6491L2.20723 92.3314L2.86186 93.0345C8.16701 98.7327 14.034 102.93 20.4651 105.602ZM96.5107 106.998V107.998H97.5107H123.466H124.466V106.998V4.19312V3.19312H123.466H97.5107H96.5107V4.19312V106.998ZM169.295 105.603L169.303 105.606L169.311 105.609C176.107 108.269 183.482 109.593 191.425 109.593C202.007 109.593 211.315 107.388 219.316 102.942L219.32 102.94C227.425 98.3932 233.745 91.7698 238.277 83.1014C242.816 74.4174 245.06 63.8573 245.06 51.4631V47.5481V46.5481H244.06H188.67H187.67V47.5481V68.7181V69.6937L188.646 69.7178L214.911 70.3684C214.603 71.1404 214.261 71.8855 213.885 72.6041L213.88 72.6125L213.876 72.6209C211.937 76.498 209.087 79.4389 205.308 81.4669L205.298 81.4719C201.614 83.4983 197.053 84.5381 191.57 84.5381C186.12 84.5381 181.32 83.3186 177.14 80.9045C173.052 78.4881 169.795 75.0967 167.364 70.7064C165.039 66.3314 163.86 61.2316 163.86 55.3781C163.86 49.5335 165.132 44.4941 167.638 40.2243C170.161 35.9259 173.513 32.6239 177.701 30.2973L177.707 30.2937C181.99 27.8733 186.844 26.6531 192.295 26.6531C197.675 26.6531 202.348 27.6908 206.34 29.7334L206.348 29.7376L206.357 29.7417C210.367 31.7004 214.078 34.6977 217.484 38.7651L218.185 39.6028L218.958 38.8302L236.357 21.4302L236.996 20.7921L236.426 20.092C231.675 14.2521 225.499 9.71307 217.924 6.46607C210.34 3.11792 201.888 1.45312 192.585 1.45312C184.734 1.45312 177.312 2.82741 170.327 5.58135C163.446 8.23601 157.392 12.0248 152.173 16.9475C146.95 21.7766 142.861 27.4934 139.908 34.0895L139.905 34.0959C137.041 40.6144 135.615 47.7613 135.615 55.5231C135.615 63.1856 136.991 70.3261 139.753 76.9337L139.756 76.9421L139.76 76.9504C142.614 83.446 146.553 89.1588 151.575 94.0822L151.582 94.089C156.701 99.0109 162.608 102.849 169.295 105.603ZM255.388 106.998V107.998H256.388H282.343H283.343V106.998V52.7751L326.507 107.617L326.807 107.998H327.293H346.578H347.578V106.998V4.19312V3.19312H346.578H320.623H319.623V4.19312V59.7542L275.298 3.57372L274.997 3.19312H274.513H256.388H255.388V4.19312V106.998ZM390.617 106.998V107.998H391.617H417.572H418.572V106.998V4.19312V3.19312H417.572H391.617H390.617V4.19312V106.998ZM434.797 106.998V107.998H435.797H461.752H462.752V106.998V52.7751L505.916 107.617L506.216 107.998H506.702H525.987H526.987V106.998V4.19312V3.19312H525.987H500.032H499.032V4.19312V59.7542L454.707 3.57372L454.407 3.19312H453.922H435.797H434.797V4.19312V106.998Z"
		fill="#EE6930"
		fill-opacity="0.35"
		stroke="#EE6930"
		stroke-width="2"
	/>
</svg>
