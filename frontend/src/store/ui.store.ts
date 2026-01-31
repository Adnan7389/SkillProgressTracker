import { create } from 'zustand';

interface UiState {
    isCreateModalOpen: boolean;
    setCreateModalOpen: (open: boolean) => void;

    // For later: notifications/toasts state
    notification: { message: string; type: 'success' | 'error' } | null;
    setNotification: (notif: { message: string; type: 'success' | 'error' } | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
    isCreateModalOpen: false,
    setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

    notification: null,
    setNotification: (notification) => {
        set({ notification });
        if (notification) {
            setTimeout(() => set({ notification: null }), 3000);
        }
    },
}));
