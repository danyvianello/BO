// Configuración principal de la aplicación
export const config = {
    // API Configuration
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
    appTitle: import.meta.env.VITE_APP_TITLE || 'RGS Backoffice',
    version: '0.1.0',
    jwtExpiration: 3600, // 1 hora en segundos
    defaultCurrency: 'USD',
    // Configuración de desarrollo
    isDevelopment: import.meta.env.DEV,
    showDevLogs: false, // Desactivar logs de desarrollo
    // Configuración de autenticación
    auth: {
        tokenKey: 'rgs_auth_token',
        userKey: 'rgs_user_data',
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
        defaultCredentials: {
            username: import.meta.env.VITE_ADMIN_USER || 'admin',
            password: import.meta.env.VITE_ADMIN_PASS || 'admin123'
        }
    }
}; 