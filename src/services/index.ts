import { config } from '../config';
import { mockApi } from './mockApi';
import * as realApi from './api';

// Exportar automáticamente mock o API real según configuración
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
} = config.useMockApi ? mockApi : realApi;

// También exportar la instancia de axios por si se necesita
export { default as api } from './api'; 