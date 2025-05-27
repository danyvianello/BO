/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_WS_URL: string
    readonly VITE_APP_TITLE: string
    readonly VITE_USE_MOCK_API: string
    readonly VITE_ADMIN_USER: string
    readonly VITE_ADMIN_PASS: string
    readonly VITE_SHOW_DEV_CREDENTIALS: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
} 