import axios from 'axios';

export const TOKEN_KEY = 'cardioguard_token';
const configuredApiUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = (configuredApiUrl || (window.location.protocol === 'file:' ? 'http://127.0.0.1:8000/api/v1' : '/api/v1')).replace(/\/$/, '');

export const api = axios.create({ baseURL: API_BASE_URL, timeout: 30000 });

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(undefined, (error) => {
    if (error.response?.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new Event('cardioguard:auth-expired'));
    }
    return Promise.reject(error);
});

export const submitAssessment = async (healthData, persist = true) => {
    const response = await api.post('/predict', healthData, { params: { persist } });
    return response.data;
};

export const registerUser = async (userData) => (await api.post('/auth/register', userData)).data;
export const loginUser = async (credentials) => (await api.post('/auth/login', credentials)).data;
export const requestPasswordReset = async (email) => (await api.post('/auth/forgot-password', { email })).data;
export const resetPassword = async (payload) => (await api.post('/auth/reset-password', payload)).data;
export const getCurrentUser = async () => (await api.get('/auth/me')).data;
export const getHistory = async () => (await api.get('/history')).data;
export const getModelInsights = async () => (await api.get('/model-insights')).data;

export function getApiErrorMessage(error, fallback) {
    if (!error.response) return 'The health service is unavailable. Please make sure the backend is running and try again.';
    const detail = error.response.data?.detail;
    if (Array.isArray(detail)) return detail.map((item) => item.msg).join(' ');
    return detail || fallback;
}