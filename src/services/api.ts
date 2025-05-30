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

// Servicios de Autenticación
export const login = (credentials: { username: string; password: string }) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    return api.post<ApiResponse<LoginResponse>>('/token', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

export const logout = () =>
    api.post<ApiResponse<null>>('/logout');

// Servicios de Usuarios
export const getUsers = () =>
    api.get<ApiResponse<PaginatedResponse<User>>>('/users');

export const createUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<User>>('/users', userData);

export const updateUser = (id: string, userData: Partial<User>) =>
    api.put<ApiResponse<User>>(`/users/${id}`, userData);

export const deleteUser = (id: string) =>
    api.delete<ApiResponse<null>>(`/users/${id}`);

// Servicios de Operadores
export const getOperators = () =>
    api.get<ApiResponse<PaginatedResponse<Operator>>>('/operators');

export const createOperator = (operatorData: Omit<Operator, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Operator>>('/operators', operatorData);

export const updateOperator = (id: string, operatorData: Partial<Operator>) =>
    api.put<ApiResponse<Operator>>(`/operators/${id}`, operatorData);

export const deleteOperator = (id: string) =>
    api.delete<ApiResponse<null>>(`/operators/${id}`);

// Servicios de Monedas
export const getCurrencies = () =>
    api.get<ApiResponse<PaginatedResponse<Currency>>>('/currencies');

export const createCurrency = (currencyData: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Currency>>('/currencies', currencyData);

export const updateCurrency = (id: string, currencyData: Partial<Currency>) =>
    api.put<ApiResponse<Currency>>(`/currencies/${id}`, currencyData);

export const deleteCurrency = (id: string) =>
    api.delete<ApiResponse<null>>(`/currencies/${id}`);

// Servicios de Juegos
export const getGames = () =>
    api.get<ApiResponse<PaginatedResponse<Game>>>('/games');

export const createGame = (gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Game>>('/games', gameData);

export const updateGame = (id: string, gameData: Partial<Game>) =>
    api.put<ApiResponse<Game>>(`/games/${id}`, gameData);

export const deleteGame = (id: string) =>
    api.delete<ApiResponse<null>>(`/games/${id}`);

// Servicios de Proveedores
export const getProviders = () =>
    api.get<ApiResponse<PaginatedResponse<Provider>>>('/providers');

export const createProvider = (providerData: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Provider>>('/providers', providerData);

export const updateProvider = (id: string, providerData: Partial<Provider>) =>
    api.put<ApiResponse<Provider>>(`/providers/${id}`, providerData);

export const deleteProvider = (id: string) =>
    api.delete<ApiResponse<null>>(`/providers/${id}`);

// Servicios de Sesiones
export const getSessions = () =>
    api.get<ApiResponse<PaginatedResponse<Session>>>('/sessions');

export const getSession = (id: string) =>
    api.get<ApiResponse<Session>>(`/sessions/${id}`);

// Servicios de Transacciones
export const getTransactions = (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    operatorId?: string;
    userId?: string;
    gameId?: string;
    type?: string;
}) =>
    api.get<ApiResponse<PaginatedResponse<Transaction>>>('/transactions', { params });

export const getTransaction = (id: string) =>
    api.get<ApiResponse<Transaction>>(`/transactions/${id}`);

// Servicios de Reportes
export const getReports = (params?: any) =>
    api.get<ApiResponse<PaginatedResponse<Report>>>('/reports', { params });

export const generateReport = (params: any) =>
    api.post<ApiResponse<Report>>('/reports/generate', params);

// Wallet reconciliation and manual adjustment
export const getWalletReconciliation = (userId: string) =>
    api.get<ApiResponse<any>>(`/wallets/${userId}`);

export const adjustWalletBalance = (userId: string, newBalance: number, reason: string, operator: string) =>
    api.post<ApiResponse<any>>(`/wallets/${userId}/adjust`, { new_balance: newBalance, reason, operator });

export default api; 