import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Use relative path for production compatibility
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
