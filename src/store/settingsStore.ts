import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isDarkMode: boolean;
  lowStockThreshold: number;
  notificationsEnabled: boolean;
  toggleDarkMode: () => void;
  setLowStockThreshold: (threshold: number) => void;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      lowStockThreshold: 5,
      notificationsEnabled: true,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setLowStockThreshold: (threshold) => set({ lowStockThreshold: threshold }),
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
    }),
    {
      name: 'settings-storage',
    }
  )
);