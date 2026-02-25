export { default as apiClient } from './client';

// ─── Health Check ───────────────────────────────────────────────
export const healthCheck = () =>
    import('./client').then(({ default: apiClient }) =>
        apiClient.get('/health').then((res) => res.data),
    );

// Add more typed API functions here as your app grows:
// export const getUsers = () => apiClient.get('/users').then(res => res.data);
// export const login = (data: LoginDto) => apiClient.post('/auth/login', data).then(res => res.data);
