// Configuración principal de la aplicación
export const config = {
    // API Configuration
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',

    // App Configuration
    appTitle: import.meta.env.VITE_APP_TITLE || 'RGS Backoffice',

    // Development Configuration
    useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false', // Por defecto true
    isDevelopment: import.meta.env.DEV,

    // Auth Configuration
    auth: {
        tokenKey: 'rgs_auth_token',
        userKey: 'rgs_user_data',
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
    }
};

// Re-exportar configuración de seguridad
export * from './security'; 