import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Vite proxy se encarga
    withCredentials: true, // Importante para Sanctum cookies
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Interceptor para debugging o manejo global de errores (opcional)
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // No autorizado
            console.warn("No autorizado. Usuario no logueado.");
        }
        return Promise.reject(error);
    }
);

export default api;
