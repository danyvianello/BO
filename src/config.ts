export const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
    appTitle: import.meta.env.VITE_APP_TITLE || 'RGS Backoffice',
    version: '0.1.0',
    jwtExpiration: 3600, // 1 hora en segundos
    defaultCurrency: 'USD',
    useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false', // Por defecto usa mock API
    defaultOperator: {
        name: 'Mi Casino',
        apiKey: 'default-api-key',
        status: 'active'
    }
}; 