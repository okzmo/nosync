import { createTuyau } from '@tuyau/client';
import { api } from 'backend/api';

export const tuyau = createTuyau({
	api,
	baseUrl: import.meta.env.VITE_API_URL,
	credentials: 'include'
});
