// Mock API para desarrollo sin backend
import {
    User,
    Operator,
    Currency,
    Game,
    Provider,
    Session,
    Transaction,
    Report,
    ApiResponse,
    PaginatedResponse,
    LoginResponse
} from '../types/api';
import { config } from '../config';

// Solo mostrar log si showDevLogs es true
if (config.showDevLogs) {
    console.log('Mock API inicializado');
}

// Configuración de usuarios para desarrollo
// IMPORTANTE: En producción, esto debe venir de variables de entorno o API segura
const DEVELOPMENT_USERS = [
    {
        username: import.meta.env.VITE_ADMIN_USER || 'admin',
        password: import.meta.env.VITE_ADMIN_PASS || 'admin123',
        userData: {
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
        }
    }
];

// Datos mock
const mockUsers: User[] = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        username: 'operator1',
        email: 'operator1@example.com',
        role: 'operator',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
];

const mockOperators: Operator[] = [
    {
        id: '1',
        name: 'Casino Royal',
        code: 'CR001',
        status: 'active',
        commission: 15.5,
        maxBet: 10000,
        minBet: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
];

const mockCurrencies: Currency[] = [
    {
        id: '1',
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        status: 'active',
        exchangeRate: 1,
        decimals: 2,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        status: 'active',
        exchangeRate: 0.85,
        decimals: 2,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
];

const mockGames: Game[] = [
    {
        id: '1',
        name: 'Mega Fortune',
        code: 'MF001',
        provider: 'NetEnt',
        type: 'slot',
        status: 'active',
        minBet: 0.25,
        maxBet: 500,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        name: 'Blackjack Classic',
        code: 'BJ001',
        provider: 'Evolution',
        type: 'table',
        status: 'active',
        minBet: 1,
        maxBet: 1000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
];

const mockProviders: Provider[] = [
    {
        id: '1',
        name: 'NetEnt',
        code: 'NETENT',
        status: 'active',
        apiKey: 'netent_api_key_123',
        apiSecret: 'netent_secret_456',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        name: 'Evolution Gaming',
        code: 'EVOLUTION',
        status: 'active',
        apiKey: 'evolution_api_key_789',
        apiSecret: 'evolution_secret_012',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
];

const mockSessions: Session[] = [
    {
        id: '1',
        userId: '1',
        gameId: '1',
        operatorId: '1',
        currency: 'USD',
        betAmount: 10,
        winAmount: 25,
        status: 'completed',
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T10:15:00Z',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:15:00Z'
    },
    {
        id: '2',
        userId: '2',
        gameId: '2',
        operatorId: '1',
        currency: 'EUR',
        betAmount: 50,
        winAmount: 0,
        status: 'completed',
        startTime: '2024-01-01T11:00:00Z',
        endTime: '2024-01-01T11:30:00Z',
        createdAt: '2024-01-01T11:00:00Z',
        updatedAt: '2024-01-01T11:30:00Z'
    }
];

const mockTransactions: Transaction[] = [
    {
        id: '1',
        sessionId: '1',
        type: 'bet',
        amount: 10,
        currency: 'USD',
        status: 'completed',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
    },
    {
        id: '2',
        sessionId: '1',
        type: 'win',
        amount: 25,
        currency: 'USD',
        status: 'completed',
        createdAt: '2024-01-01T10:15:00Z',
        updatedAt: '2024-01-01T10:15:00Z'
    }
];

const mockReports: Report[] = [
    {
        id: '1',
        type: 'transactions',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        status: 'completed',
        url: 'https://example.com/reports/transactions_jan_2024.pdf',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
    }
];

// Función helper para simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
    // Auth - Versión más segura
    login: async (credentials: { username: string; password: string }) => {
        console.log('Mock API: login llamado');
        await delay(1000);

        // Buscar usuario válido
        const validUser = DEVELOPMENT_USERS.find(
            user => user.username === credentials.username && user.password === credentials.password
        );

        if (validUser) {
            const response: ApiResponse<LoginResponse> = {
                data: {
                    token: `mock_jwt_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    user: validUser.userData
                },
                status: 200,
                message: 'Login successful'
            };
            return { data: response };
        }

        // Simular delay incluso para credenciales incorrectas (seguridad)
        await delay(500);
        throw new Error('Credenciales inválidas');
    },

    logout: async () => {
        await delay(500);
        return { data: { data: null, status: 200 } };
    },

    // Users
    getUsers: async () => {
        console.log('Mock API: getUsers llamado');
        await delay(800);
        const response: ApiResponse<PaginatedResponse<User>> = {
            data: {
                data: mockUsers,
                total: mockUsers.length,
                page: 1,
                limit: 10,
                totalPages: 1
            },
            status: 200
        };
        return { data: response };
    },

    createUser: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
        await delay(1000);
        const newUser: User = {
            ...userData,
            id: String(mockUsers.length + 1),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockUsers.push(newUser);
        return { data: { data: newUser, status: 201 } };
    },

    updateUser: async (id: string, userData: Partial<User>) => {
        await delay(1000);
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) throw new Error('User not found');
        mockUsers[index] = { ...mockUsers[index], ...userData, updatedAt: new Date().toISOString() };
        return { data: { data: mockUsers[index], status: 200 } };
    },

    deleteUser: async (id: string) => {
        await delay(800);
        const index = mockUsers.findIndex(u => u.id === id);
        if (index === -1) throw new Error('User not found');
        mockUsers.splice(index, 1);
        return { data: { data: null, status: 200 } };
    },

    // Operators
    getOperators: async () => {
        await delay(800);
        const response: ApiResponse<PaginatedResponse<Operator>> = {
            data: {
                data: mockOperators,
                total: mockOperators.length,
                page: 1,
                limit: 10,
                totalPages: 1
            },
            status: 200
        };
        return { data: response };
    },

    createOperator: async (operatorData: Omit<Operator, 'id' | 'createdAt' | 'updatedAt'>) => {
        await delay(1000);
        const newOperator: Operator = {
            ...operatorData,
            id: String(mockOperators.length + 1),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockOperators.push(newOperator);
        return { data: { data: newOperator, status: 201 } };
    },

    updateOperator: async (id: string, operatorData: Partial<Operator>) => {
        await delay(1000);
        const index = mockOperators.findIndex(o => o.id === id);
        if (index === -1) throw new Error('Operator not found');
        mockOperators[index] = { ...mockOperators[index], ...operatorData, updatedAt: new Date().toISOString() };
        return { data: { data: mockOperators[index], status: 200 } };
    },

    deleteOperator: async (id: string) => {
        await delay(800);
        const index = mockOperators.findIndex(o => o.id === id);
        if (index === -1) throw new Error('Operator not found');
        mockOperators.splice(index, 1);
        return { data: { data: null, status: 200 } };
    },

    // Currencies
    getCurrencies: async () => {
        await delay(800);
        const response: ApiResponse<PaginatedResponse<Currency>> = {
            data: {
                data: mockCurrencies,
                total: mockCurrencies.length,
                page: 1,
                limit: 10,
                totalPages: 1
            },
            status: 200
        };
        return { data: response };
    },

    createCurrency: async (currencyData: Omit<Currency, 'id' | 'createdAt' | 'updatedAt'>) => {
        await delay(1000);
        const newCurrency: Currency = {
            ...currencyData,
            id: String(mockCurrencies.length + 1),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockCurrencies.push(newCurrency);
        return { data: { data: newCurrency, status: 201 } };
    },

    updateCurrency: async (id: string, currencyData: Partial<Currency>) => {
        await delay(1000);
        const index = mockCurrencies.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Currency not found');
        mockCurrencies[index] = { ...mockCurrencies[index], ...currencyData, updatedAt: new Date().toISOString() };
        return { data: { data: mockCurrencies[index], status: 200 } };
    },

    deleteCurrency: async (id: string) => {
        await delay(800);
        const index = mockCurrencies.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Currency not found');
        mockCurrencies.splice(index, 1);
        return { data: { data: null, status: 200 } };
    },

    // Games
    getGames: async () => {
        await delay(800);
        const response: ApiResponse<PaginatedResponse<Game>> = {
            data: {
                data: mockGames,
                total: mockGames.length,
                page: 1,
                limit: 10,
                totalPages: 1
            },
            status: 200
        };
        return { data: response };
    },

    createGame: async (gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) => {
        await delay(1000);
        const newGame: Game = {
            ...gameData,
            id: String(mockGames.length + 1),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockGames.push(newGame);
        return { data: { data: newGame, status: 201 } };
    },

    updateGame: async (id: string, gameData: Partial<Game>) => {
        await delay(1000);
        const index = mockGames.findIndex(g => g.id === id);
        if (index === -1) throw new Error('Game not found');
        mockGames[index] = { ...mockGames[index], ...gameData, updatedAt: new Date().toISOString() };
        return { data: { data: mockGames[index], status: 200 } };
    },

    deleteGame: async (id: string) => {
        await delay(800);
        const index = mockGames.findIndex(g => g.id === id);
        if (index === -1) throw new Error('Game not found');
        mockGames.splice(index, 1);
        return { data: { data: null, status: 200 } };
    },

    // Providers
    getProviders: async () => {
        await delay(800);
        const response: ApiResponse<PaginatedResponse<Provider>> = {
            data: {
                data: mockProviders,
                total: mockProviders.length,
                page: 1,
                limit: 10,
                totalPages: 1
            },
            status: 200
        };
        return { data: response };
    },

    createProvider: async (providerData: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>) => {
        await delay(1000);
        const newProvider: Provider = {
            ...providerData,
            id: String(mockProviders.length + 1),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockProviders.push(newProvider);
        return { data: { data: newProvider, status: 201 } };
    },

    updateProvider: async (id: string, providerData: Partial<Provider>) => {
        await delay(1000);
        const index = mockProviders.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Provider not found');
        mockProviders[index] = { ...mockProviders[index], ...providerData, updatedAt: new Date().toISOString() };
        return { data: { data: mockProviders[index], status: 200 } };
    },

    deleteProvider: async (id: string) => {
        await delay(800);
        const index = mockProviders.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Provider not found');
        mockProviders.splice(index, 1);
        return { data: { data: null, status: 200 } };
    },

    // Sessions
    getSessions: async () => {
        await delay(800);
        const response: ApiResponse<PaginatedResponse<Session>> = {
            data: {
                data: mockSessions,
                total: mockSessions.length,
                page: 1,
                limit: 10,
                totalPages: 1
            },
            status: 200
        };
        return { data: response };
    },

    getSession: async (id: string) => {
        await delay(500);
        const session = mockSessions.find(s => s.id === id);
        if (!session) throw new Error('Session not found');
        return { data: { data: session, status: 200 } };
    },

    // Transactions
    getTransactions: async (params: any) => {
        await delay(800);
        const response: ApiResponse<PaginatedResponse<Transaction>> = {
            data: {
                data: mockTransactions,
                total: mockTransactions.length,
                page: 1,
                limit: 10,
                totalPages: 1
            },
            status: 200
        };
        return { data: response };
    },

    getTransaction: async (id: string) => {
        await delay(500);
        const transaction = mockTransactions.find(t => t.id === id);
        if (!transaction) throw new Error('Transaction not found');
        return { data: { data: transaction, status: 200 } };
    },

    // Reports
    getReports: async (params: any) => {
        await delay(800);
        const response: ApiResponse<PaginatedResponse<Report>> = {
            data: {
                data: mockReports,
                total: mockReports.length,
                page: 1,
                limit: 10,
                totalPages: 1
            },
            status: 200
        };
        return { data: response };
    },

    generateReport: async (type: string, params: any) => {
        await delay(2000);
        const newReport: Report = {
            id: String(mockReports.length + 1),
            type,
            startDate: params.startDate,
            endDate: params.endDate,
            status: 'completed',
            url: `https://example.com/reports/${type}_${Date.now()}.pdf`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        mockReports.push(newReport);
        return { data: { data: newReport, status: 201 } };
    }
}; 