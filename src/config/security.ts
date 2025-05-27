// Configuración de seguridad para el RGS Backoffice

export const SecurityConfig = {
    // Configuración de desarrollo
    isDevelopment: import.meta.env.DEV,
    useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',

    // URLs de API
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',

    // Configuración de autenticación
    auth: {
        tokenKey: 'rgs_auth_token',
        userKey: 'rgs_user_data',
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
    },

    // Configuración de desarrollo (SOLO para desarrollo)
    development: {
        defaultCredentials: {
            username: import.meta.env.VITE_ADMIN_USER || 'admin',
            password: import.meta.env.VITE_ADMIN_PASS || 'admin123'
        },
        showCredentialsInConsole: import.meta.env.DEV && import.meta.env.VITE_SHOW_DEV_CREDENTIALS === 'true'
    },

    // Configuración de producción
    production: {
        enforceHttps: true,
        enableCSRF: true,
        enableCORS: false,
        maxLoginAttempts: 3,
        lockoutDuration: 15 * 60 * 1000, // 15 minutos
    }
};

// Función para obtener configuración según el entorno
export const getSecurityConfig = () => {
    if (SecurityConfig.isDevelopment) {
        return {
            ...SecurityConfig,
            ...SecurityConfig.development
        };
    }
    return {
        ...SecurityConfig,
        ...SecurityConfig.production
    };
};

// Función para validar si estamos en modo seguro
export const isSecureMode = () => {
    return !SecurityConfig.isDevelopment || !SecurityConfig.useMockApi;
};

// Función para mostrar advertencias de seguridad
export const showSecurityWarnings = () => {
    if (SecurityConfig.isDevelopment && SecurityConfig.useMockApi) {
        console.warn('🚨 MODO DESARROLLO ACTIVO');
        console.warn('📝 Usando datos mock para desarrollo');
        console.warn('🔐 Credenciales de prueba activas');
        console.warn('⚠️  NO usar en producción');

        if (SecurityConfig.development.showCredentialsInConsole) {
            console.info('👤 Credenciales de desarrollo:');
            console.info(`   Usuario: ${SecurityConfig.development.defaultCredentials.username}`);
            console.info(`   Contraseña: ${SecurityConfig.development.defaultCredentials.password}`);
        }
    }
}; 