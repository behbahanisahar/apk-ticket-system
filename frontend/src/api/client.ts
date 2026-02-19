import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (err: AxiosError) => {
    const orig = err.config as typeof err.config & { _retry?: boolean };
    const isLoginRequest = orig?.url?.includes('/auth/token/') && !orig?.url?.includes('/refresh/');
    if (err.response?.status === 401 && !orig._retry && !isLoginRequest) {
      orig._retry = true;
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        try {
          const { data } = await axios.post<{ access: string }>(
            `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/token/refresh/`,
            { refresh }
          );
          localStorage.setItem('access', data.access);
          if (orig.headers) orig.headers.Authorization = `Bearer ${data.access}`;
          return api(orig);
        } catch {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          sessionStorage.setItem('auth_expired', '1');
          window.location.href = '/login';
        }
      } else {
        sessionStorage.setItem('auth_expired', '1');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
