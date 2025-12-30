import axios from 'axios';

const api = axios.create({
    baseURL: typeof window !== 'undefined'
        ? `${window.location.origin}/api`  // Browser: use current origin
        : '/api',  // Server: use relative
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
