const TOKEN_KEY = 'rgs_token';
const USER_KEY = 'rgs_user';
const THEME_KEY = 'rgs_theme';
const LANGUAGE_KEY = 'rgs_language';

export const storage = {
    // Token
    getToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },
    setToken: (token: string): void => {
        localStorage.setItem(TOKEN_KEY, token);
    },
    removeToken: (): void => {
        localStorage.removeItem(TOKEN_KEY);
    },

    // Usuario
    getUser: (): any | null => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    setUser: (user: any): void => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    removeUser: (): void => {
        localStorage.removeItem(USER_KEY);
    },

    // Tema
    getTheme: (): 'light' | 'dark' => {
        return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
    },
    setTheme: (theme: 'light' | 'dark'): void => {
        localStorage.setItem(THEME_KEY, theme);
    },

    // Idioma
    getLanguage: (): string => {
        return localStorage.getItem(LANGUAGE_KEY) || 'es';
    },
    setLanguage: (language: string): void => {
        localStorage.setItem(LANGUAGE_KEY, language);
    },

    // Limpiar todo
    clear: (): void => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(THEME_KEY);
        localStorage.removeItem(LANGUAGE_KEY);
    },
}; 