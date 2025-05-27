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
                    const { user, token } = response.data.data;
                    storage.setToken(token);
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