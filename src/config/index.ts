// Configuración principal de la aplicación
export const config = {
    // API Configuration - Conectar al Engine Python
    apiUrl: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1/backoffice',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://127.0.0.1:8000',

    // App Configuration
    appTitle: import.meta.env.VITE_APP_TITLE || 'RGS Backoffice',

    // Development Configuration
    isDevelopment: import.meta.env.DEV,
    showDevLogs: false, // Desactivar logs de desarrollo

    // Auth Configuration
    auth: {
        tokenKey: 'rgs_auth_token',
        userKey: 'rgs_user_data',
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
    }
};

// Re-exportar configuración de seguridad
export * from './security'; 