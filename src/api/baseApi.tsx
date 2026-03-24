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

// INTERCEPTOR DE RESPUESTA: El "Portero" que te saca si el token expira
baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde 401 (No autorizado)
    if (error.response && error.response.status === 401) {
      localStorage.clear(); // Limpiamos todo de un golpe
      window.location.href = '/login'; // Salto forzado al login
    }
    return Promise.reject(error);
  }
);

export default baseApi;