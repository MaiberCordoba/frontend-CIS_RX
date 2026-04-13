import axios from 'axios';

const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

baseApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const isLoginRequest = originalRequest?.url?.includes('login'); // <- más flexible
    if (error.response && error.response.status === 401 && !isLoginRequest) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default baseApi;