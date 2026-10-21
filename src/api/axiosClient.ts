import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor global: Si el backend responde 401 (sesión expirada o borrada), redirige al inicio
apiClient.interceptors.response.use(
  (response) => {
    // Disparamos un evento personalizado en ventana cada vez que una petición al backend tiene éxito
    window.dispatchEvent(new CustomEvent('session-active-api-call'));
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('session-expired'));
    }
    return Promise.reject(error);
  },
);