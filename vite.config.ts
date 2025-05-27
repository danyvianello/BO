import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        host: true,
        watch: {
            usePolling: true,
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
    define: {
        // Valores por defecto para variables de entorno
        'import.meta.env.VITE_USE_MOCK_API': JSON.stringify(process.env.VITE_USE_MOCK_API || 'true'),
        'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8000'),
        'import.meta.env.VITE_WS_URL': JSON.stringify(process.env.VITE_WS_URL || 'ws://localhost:8000'),
        'import.meta.env.VITE_APP_TITLE': JSON.stringify(process.env.VITE_APP_TITLE || 'RGS Backoffice'),
        'import.meta.env.VITE_ADMIN_USER': JSON.stringify(process.env.VITE_ADMIN_USER || 'admin'),
        'import.meta.env.VITE_ADMIN_PASS': JSON.stringify(process.env.VITE_ADMIN_PASS || 'admin123'),
        'import.meta.env.VITE_SHOW_DEV_CREDENTIALS': JSON.stringify(process.env.VITE_SHOW_DEV_CREDENTIALS || 'false'),
    },
}); 