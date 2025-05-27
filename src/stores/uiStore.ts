import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface UIState {
    notifications: Notification[];
    isLoading: boolean;
    loadingMessage?: string;
    addNotification: (message: string, type: Notification['type']) => void;
    removeNotification: (id: string) => void;
    setLoading: (isLoading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
    notifications: [],
    isLoading: false,
    loadingMessage: undefined,
    addNotification: (message, type) => {
        const id = uuidv4();
        set((state) => ({
            notifications: [...state.notifications, { id, message, type }],
        }));
        // Auto-remove notification after 6 seconds
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 6000);
    },
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
    setLoading: (isLoading, message) =>
        set({ isLoading, loadingMessage: message }),
})); 