import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginService } from '../services';
import { storage } from '../utils/storage';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: storage.getUser(),
            isAuthenticated: !!storage.getToken(),
            login: async (username: string, password: string) => {
                try {
                    const response = await loginService({ username, password });
                    const { access_token } = response.data;
                    storage.setToken(access_token);
                    // Crear un objeto de usuario básico
                    const user = {
                        id: 1,
                        username: username,
                        email: 'admin@rgs.com',
                        role: 'admin'
                    };
                    storage.setUser(user);
                    set({ user, isAuthenticated: true });
                } catch (error) {
                    throw error;
                }
            },
            logout: () => {
                storage.clear();
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
); 