import { tuyau } from '$lib/api';
import type { LoginForm, RegisterForm } from '$lib/schemas/auth';
import type { TUser } from '$lib/types/user';

class Auth {
	user = $state<TUser>();

	async register(user: RegisterForm) {
		const { error } = await tuyau.v1.auth.register.$post(user);
		if (error?.status === 403 && error.value.cause === 'email') {
			return { status: 'error.register.email', message: error.value.message };
		}

		return { status: 'success' };
	}

	async login(user: LoginForm) {
		const { error } = await tuyau.v1.auth.login.$post(user);
		if (error?.status === 400) {
			return { status: 'error.login.invalid', message: 'Email or password invalid.' };
		}

		return { status: 'success' };
	}

	async check() {
		const { data, error } = await tuyau.v1.auth.valid.$get();
		if (error?.status === 401) {
			return { status: 'error.auth_invalid' };
		}

		this.user = {
			...data.user,
			spaces: data.spaces
		};

		return { status: 'success' };
	}
}

export const auth = new Auth();
