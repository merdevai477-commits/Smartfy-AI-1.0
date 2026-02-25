import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// ─── Environment Validation ─────────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
    throw new Error(
        '❌ NEXT_PUBLIC_API_URL is not defined. Check your .env file.\n' +
        'Expected: NEXT_PUBLIC_API_URL=https://api.smartfyai.com',
    );
}

// ─── Axios Instance ─────────────────────────────────────────────
const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true,
});

// ─── Request Interceptor ────────────────────────────────────────
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptor ───────────────────────────────────────
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // Handle 401 — Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const { data } = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
                        refreshToken,
                    });
                    localStorage.setItem('access_token', data.accessToken);
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    }
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle 503 — Service unavailable
        if (error.response?.status === 503) {
            console.error('🔴 API Service Unavailable');
        }

        return Promise.reject(error);
    },
);

export default apiClient;
