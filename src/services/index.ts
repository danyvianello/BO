import { config } from '../config';
import { mockApi } from './mockApi';
import * as realApi from './api';

// Log para debug
console.log('useMockApi:', config.useMockApi);

// Exportar automáticamente mock o API real según configuración
const api = config.useMockApi ? mockApi : realApi;

// Log para debug
console.log('API seleccionada:', config.useMockApi ? 'mockApi' : 'realApi');

// Exportar todos los servicios
export const {
    // Auth
    login,
    logout,

    // Users
    getUsers,
    createUser,
    updateUser,
    deleteUser,

    // Operators
    getOperators,
    createOperator,
    updateOperator,
    deleteOperator,

    // Currencies
    getCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,

    // Games
    getGames,
    createGame,
    updateGame,
    deleteGame,

    // Providers
    getProviders,
    createProvider,
    updateProvider,
    deleteProvider,

    // Sessions
    getSessions,
    getSession,

    // Transactions
    getTransactions,
    getTransaction,

    // Reports
    getReports,
    generateReport,
} = api;

// También exportar la instancia de axios por si se necesita
export { default as api } from './api'; 