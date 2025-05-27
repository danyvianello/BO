import axios, { AxiosError } from 'axios';
import { config } from '../config';
import { useUIStore } from '../stores/uiStore';
import { storage } from '../utils/storage';
import {
    ApiResponse,
    PaginatedResponse,
    User,
    Operator,
    Currency,
    Game,
    Provider,
    Session,
    Transaction,
    Report,
    LoginResponse
} from '../types/api';

const api = axios.create({
    baseURL: config.apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token de autenticación
api.interceptors.request.use((config) => {
    const token = storage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const { addNotification } = useUIStore.getState();

        if (error.response?.status === 401) {
            storage.clear();
            window.location.href = '/login';
            addNotification('Sesión expirada. Por favor, inicie sesión nuevamente.', 'warning');
        } else if (error.response?.status === 403) {
            addNotification('No tiene permisos para realizar esta acción.', 'error');
        } else if (error.response?.status === 404) {
            addNotification('Recurso no encontrado.', 'error');
        } else if (error.response?.status === 500) {
            addNotification('Error interno del servidor.', 'error');
        } else {
            addNotification(error.message || 'Ha ocurrido un error.', 'error');
        }

        return Promise.reject(error);
    }
);

// Servicios de Usuarios
export const getUsers = () => api.get<ApiResponse<PaginatedResponse<User>>>('/users');
export const createUser = (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<User>>('/users', data);
export const updateUser = (id: string, data: Partial<User>) =>
    api.put<ApiResponse<User>>(`/users/${id}`, data);
export const deleteUser = (id: string) => api.delete<ApiResponse<void>>(`/users/${id}`);

// Servicios de Operadores
export const getOperators = () => api.get<ApiResponse<PaginatedResponse<Operator>>>('/operators');
export const createOperator = (data: Omit<Operator, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Operator>>('/operators', data);
export const updateOperator = (id: string, data: Partial<Operator>) =>
    api.put<ApiResponse<Operator>>(`/operators/${id}`, data);
export const deleteOperator = (id: string) => api.delete<ApiResponse<void>>(`/operators/${id}`);

// Servicios de Monedas
export const getCurrencies = () => api.get<ApiResponse<PaginatedResponse<Currency>>>('/currencies');
export const createCurrency = (data: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Currency>>('/currencies', data);
export const updateCurrency = (id: string, data: Partial<Currency>) =>
    api.put<ApiResponse<Currency>>(`/currencies/${id}`, data);
export const deleteCurrency = (id: string) => api.delete<ApiResponse<void>>(`/currencies/${id}`);

// Servicios de Autenticación
export const login = async (credentials: { username: string; password: string }) => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    const { token, user } = response.data.data;
    storage.setToken(token);
    storage.setUser(user);
    return response;
};

export const logout = async () => {
    await api.post<ApiResponse<void>>('/auth/logout');
    storage.clear();
};

// Servicios de Juegos
export const getGames = () => api.get<ApiResponse<PaginatedResponse<Game>>>('/games');
export const createGame = (data: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Game>>('/games', data);
export const updateGame = (id: string, data: Partial<Game>) =>
    api.put<ApiResponse<Game>>(`/games/${id}`, data);
export const deleteGame = (id: string) => api.delete<ApiResponse<void>>(`/games/${id}`);

// Servicios de Proveedores
export const getProviders = () => api.get<ApiResponse<PaginatedResponse<Provider>>>('/providers');
export const createProvider = (data: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Provider>>('/providers', data);
export const updateProvider = (id: string, data: Partial<Provider>) =>
    api.put<ApiResponse<Provider>>(`/providers/${id}`, data);
export const deleteProvider = (id: string) => api.delete<ApiResponse<void>>(`/providers/${id}`);

// Servicios de Sesiones
export const getSessions = () => api.get<ApiResponse<PaginatedResponse<Session>>>('/sessions');
export const getSession = (id: string) => api.get<ApiResponse<Session>>(`/sessions/${id}`);

// Servicios de Reportes
export const getReports = (params: any) => api.get<ApiResponse<PaginatedResponse<Report>>>('/reports', { params });
export const generateReport = (type: string, params: any) =>
    api.post<ApiResponse<Report>>(`/reports/${type}`, params);

// Servicios de Transacciones
export const getTransactions = (params: any) => api.get<ApiResponse<PaginatedResponse<Transaction>>>('/transactions', { params });
export const getTransaction = (id: string) => api.get<ApiResponse<Transaction>>(`/transactions/${id}`);

export default api; 