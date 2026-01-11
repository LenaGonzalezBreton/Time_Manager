import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/api.config';
// Création d'une instance axios avec la configuration de base
const apiClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour injecter le token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    console.log('[API Interceptor] Token from localStorage:', token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[API Interceptor] Added Authorization header');
    } else {
        console.warn('[API Interceptor] No token found in localStorage');
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Service API générique pour faire des appels HTTP
class ApiService {
    // Méthode GET - pour récupérer des données
    async get<T>(url: string): Promise<T> {
        const response = await apiClient.get(url);
        return response.data;
    }

    // Méthode POST-pour créer des données
    async post<T>(url: string, data: any): Promise<T> {
        const response = await apiClient.post(url, data);
        return response.data;
    }

    // Méthode PUT-pour mettre à jour des données
    async put<T>(url: string, data: any): Promise<T> {
        const response = await apiClient.put(url, data);
        return response.data;
    }

    // Méthode DELETE - pour supprimer des données
    async delete<T>(url: string): Promise<T> {
        const response = await apiClient.delete(url);
        return response.data;
    }
}

export default new ApiService();